// backend/scripts/run_all_checks.js (Using Sequelize)

import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import fs from "fs";

import sequelize from "../db/db.js";
import User from "../models/User.js";
import UserSubscription from "../models/UserSubscription.js";
import AnalysisResult from "../models/AnalysisResult.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonScriptsDir = path.resolve(
  __dirname,
  "..",
  "services",
  "google-earth"
);

function runGeeScript(
  scriptName,
  regionGeoJson,
  regionId,
  credentialsPath,
  extraInputData = {}
) {
  return new Promise((resolve, reject) => {
    const pythonExecutable = "python";
    const scriptPath = path.resolve(pythonScriptsDir, scriptName);

    if (!fs.existsSync(scriptPath)) {
      return reject(
        new Error(`Python script not found at path: ${scriptPath}`)
      );
    }

    console.log(`   Executing Python script: ${scriptPath}`);

    const pythonProcess = spawn(pythonExecutable, [
      scriptPath,
      credentialsPath,
    ]);

    const inputData = {
      geometry: regionGeoJson,
      region_id: regionId,
      ...extraInputData,
    };
    const inputJsonString = JSON.stringify(inputData);

    let scriptOutput = "";
    let scriptError = "";

    pythonProcess.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });
    pythonProcess.stderr.on("data", (data) => {
      scriptError += data.toString();
      console.error(
        `   Python stderr (${scriptName}): ${data.toString().trim()}`
      );
    });

    pythonProcess.on("close", (code) => {
      console.log(`   Python script '${scriptName}' exited with code ${code}`);
      if (code === 0) {
        try {
          const trimmedOutput = scriptOutput.trim();
          if (!trimmedOutput) {
            console.error(
              `   ERROR: Python script '${scriptName}' returned empty output.`
            );
            resolve({
              status: "error",
              message: "Python script returned empty output.",
              region_id: regionId,
            });
            return;
          }
          const result = JSON.parse(trimmedOutput);
          result.region_id = result.region_id || regionId;
          console.log(`   Successfully parsed output from ${scriptName}.`);
          resolve(result);
        } catch (parseError) {
          console.error(
            `   Failed to parse Python JSON output from ${scriptName}:`,
            parseError
          );
          console.error(`   Raw Python output (${scriptName}):`, scriptOutput);
          reject(
            new Error(
              `Failed to parse JSON from ${scriptName}: ${parseError.message}`
            )
          );
        }
      } else {
        console.error(
          `   Python script '${scriptName}' failed with exit code ${code}.`
        );
        resolve({
          status: "error",
          message: `Python script exited with code ${code}. Error output: ${scriptError}`,
          region_id: regionId,
        });
      }
    });

    pythonProcess.on("error", (err) => {
      console.error(
        `   Failed to start Python subprocess for ${scriptName}:`,
        err
      );
      reject(
        new Error(
          `Failed to start Python process for ${scriptName}: ${err.message}`
        )
      );
    });

    try {
      console.log(
        `   Writing input data to Python stdin (${scriptName}):`,
        inputJsonString
      );
      pythonProcess.stdin.write(inputJsonString);
      pythonProcess.stdin.end();
    } catch (stdinError) {
      console.error(
        `   Error writing to Python stdin (${scriptName}):`,
        stdinError
      );
      reject(
        new Error(
          `Error writing to Python stdin for ${scriptName}: ${stdinError.message}`
        )
      );
    }
  });
}

function runDeforestationCheck(
  regionGeoJson,
  regionId,
  credentialsPath,
  threshold
) {
  return runGeeScript(
    "deforestation.py",
    regionGeoJson,
    regionId,
    credentialsPath,
    { threshold: threshold }
  );
}

async function saveAnalysisResult(resultData) {
  if (!resultData) {
    console.error("No analysis data provided to save.");
    return { success: false, message: "No data to save." };
  }
  console.log("\n--- Inserting analysis result via Sequelize ---");
  resultData.analysis_type = resultData.analysis_type || "UNKNOWN";
  resultData.status = resultData.status || "error";
  resultData.alert_triggered = resultData.alert_triggered === true;
  const dateFields = [
    "recent_period_start",
    "recent_period_end",
    "previous_period_start",
    "previous_period_end",
  ];
  dateFields.forEach((field) => {
    if (resultData[field]) {
      try {
        resultData[field] = new Date(resultData[field]);
      } catch (e) {
        console.warn(`Could not parse date for ${field}: ${resultData[field]}`);
        delete resultData[field];
      }
    }
  });
  Object.keys(resultData).forEach(
    (key) => resultData[key] === undefined && delete resultData[key]
  );
  try {
    const createdResult = await AnalysisResult.create(resultData);
    console.log("--- Sequelize Insert Success ---");
    console.log("Inserted:", createdResult.toJSON());
    return { success: true, data: createdResult.toJSON() };
  } catch (insertError) {
    console.error("--- Sequelize Insert Error ---");
    console.error(insertError);
    return { success: false, message: `Failed save: ${insertError.message}` };
  }
}

async function processSubscription(subscription, credentialsPath) {
  const {
    id: subscriptionId,
    userId,
    region_geometry: regionGeoJson,
    alert_categories = [],
    is_active,
  } = subscription;
  if (!is_active) {
    console.log(`Subscription ${subscriptionId} inactive.`);
    return;
  }
  if (!alert_categories || alert_categories.length === 0) {
    console.log(`Sub ${subscriptionId} has no categories.`);
    return;
  }

  console.log(
    `\n--- Processing Active Subscription ID: ${subscriptionId} for User: ${userId} ---`
  );
  console.log(`   Categories: ${alert_categories.join(", ")}`);

  const analysisTasks = {
    DEFORESTATION: {
      runner: runDeforestationCheck,
      threshold: subscription.threshold_deforestation || -0.1,
    },
  };

  for (const category of alert_categories) {
    console.log(`\n   Checking category: ${category}...`);
    const task = analysisTasks[category.toUpperCase()];
    if (!task || !task.runner) {
      console.warn(
        `   -> Task/Runner not found/implemented for ${category}. Skipping.`
      );
      continue;
    }

    let analysisResultData = null;
    try {
      console.log(`   -> Running analysis for ${category}...`);
      const result = await task.runner(
        regionGeoJson,
        subscriptionId.toString(),
        credentialsPath,
        task.threshold
      );
      console.log(`   --- GEE Check Result (${category}) ---`);
      console.log(JSON.stringify(result, null, 2));

      analysisResultData = {
        subscriptionId: subscriptionId,
        userId: userId,
        analysis_type: category.toUpperCase(),
        status: result.status,
        alert_triggered: result.alert_triggered || false,
        calculated_value:
          result.mean_ndvi_change ??
          result.mean_ndbi_change ??
          result.mean_ndwi_change ??
          result.calculated_value ??
          null,
        threshold_value: result.threshold || task.threshold,
        details: result.message || null,
        recent_period_start: result.recent_period_start || null,
        recent_period_end: result.recent_period_end || null,
        previous_period_start: result.previous_period_start || null,
        previous_period_end: result.previous_period_end || null,
        buffer_radius_meters: result.buffer_radius_meters || null,
      };

      if (result.status !== "success") {
        delete analysisResultData.recent_period_start;
        delete analysisResultData.recent_period_end;
        delete analysisResultData.previous_period_start;
        delete analysisResultData.previous_period_end;
      }
    } catch (error) {
      console.error(`   --- Error Running ${category} Check (JS Level) ---`);
      console.error(error.message);
      analysisResultData = {
        subscriptionId: subscriptionId,
        userId: userId,
        analysis_type: category.toUpperCase(),
        status: "error",
        alert_triggered: false,
        details: `Node.js Orchestration/Runner Error: ${error.message}`,
        threshold_value: task.threshold,
      };
    }

    if (analysisResultData) {
      await saveAnalysisResult(analysisResultData);
    }
  }
  console.log(`--- Finished Processing Subscription ID: ${subscriptionId} ---`);
}

async function runAllChecks() {
  console.log("--- Starting Orchestration: Run All Checks (Sequelize) ---");

  const rawCredentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!rawCredentialsPath) {
    console.error("ERROR: GOOGLE_APPLICATION_CREDENTIALS env var not set.");
    process.exit(1);
  }
  let credentialsPath = rawCredentialsPath.trim();
  if (
    (credentialsPath.startsWith('"') && credentialsPath.endsWith('"')) ||
    (credentialsPath.startsWith("'") && credentialsPath.endsWith("'"))
  ) {
    credentialsPath = credentialsPath.substring(1, credentialsPath.length - 1);
  }
  if (!fs.existsSync(credentialsPath)) {
    console.error(`ERROR: Credentials file not found: ${credentialsPath}`);
    process.exit(1);
  }
  console.log(`Using credentials file: ${credentialsPath}`);

  console.log("Fetching active subscriptions via Sequelize...");
  let subscriptions = [];
  try {
    subscriptions = await UserSubscription.findAll({
      where: { is_active: true },
      attributes: [
        "id",
        "userId",
        "region_geometry",
        "alert_categories",
        "is_active",
      ],
    });
  } catch (fetchError) {
    console.error("--- Error fetching subscriptions via Sequelize ---");
    console.error(fetchError);
    return;
  }

  if (!subscriptions || subscriptions.length === 0) {
    console.log("No active subscriptions found.");
    return;
  }
  console.log(`Found ${subscriptions.length} active subscriptions.`);

  console.log("\n--- Processing subscriptions sequentially ---");
  for (const sub of subscriptions) {
    await processSubscription(sub.get({ plain: true }), credentialsPath);
  }

  console.log("\n--- Main Orchestration Finished (Sequelize) ---");
}

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection verified. Starting checks...");
    runAllChecks();
  })
  .catch((err) => {
    console.error("Database connection failed. Cannot start checks:", err);
  });
