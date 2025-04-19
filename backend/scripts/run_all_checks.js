import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import fs from "fs";

import sequelize from "../db/db.js";
import User from "../models/user.model.js";
import UserSubscription from "../models/userSubscription.model.js";
import AnalysisResult from "../models/analysisResult.model.js";
import { sendAlertNotification } from "../utils/alertNotifier.js";

// --- Import flooding and glacier melting runners ---
import { runFloodCheck } from "../services/google-earth/flooding/flooding.js";
import { runGlacierMeltingCheck } from "../services/google-earth/glacier/glacier_melting.js";
// --- Import coastal erosion runner ---
import { runCoastalErosionCheck } from "../services/google-earth/coastal_erosion/coastal_erosion.js";
// --- Import fire protection runner ---
import { runFireProtectionCheck } from "../services/google-earth/fire/fireProtection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonScriptsDir = path.resolve(
  __dirname,
  "..",
  "services",
  "google-earth",
  "deforestation"
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

function runFloodingCheck(
  regionGeoJson,
  regionId,
  credentialsPath,
  threshold_percent,
  buffer_meters
) {
  return runFloodCheck(
    regionGeoJson,
    regionId,
    credentialsPath,
    threshold_percent,
    buffer_meters
  );
}

function runGlacierCheck(
  regionGeoJson,
  regionId,
  credentialsPath,
  threshold_percent,
  buffer_meters
) {
  return runGlacierMeltingCheck(
    regionGeoJson,
    regionId,
    credentialsPath,
    threshold_percent,
    buffer_meters
  );
}

function runCoastalErosionCheckWrapper(
  regionGeoJson,
  regionId,
  credentialsPath,
  threshold
) {
  return runCoastalErosionCheck(
    regionGeoJson,
    regionId,
    credentialsPath,
    threshold
  );
}

// --- Fire Protection Runner ---
function runFireProtectionCheckWrapper(
  regionGeoJson,
  regionId,
  credentialsPath,
  days_back
) {
  // days_back is how many days to look back for active fires (default: 1)
  return runFireProtectionCheck(
    regionGeoJson,
    regionId,
    credentialsPath,
    days_back ?? 1
  );
}

// --- Normalize category for robust mapping ---
function normalizeCategory(category) {
  // glacierMelting -> GLACIER_MELTING, "Glacier Melting" -> GLACIER_MELTING, etc.
  return category
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s\-]+/g, "_")
    .toUpperCase();
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

  // Date field normalization as before...
  const dateFields = [
    "recent_period_start",
    "recent_period_end",
    "previous_period_start",
    "previous_period_end",
    "baseline_period_start",
    "baseline_period_end",
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

    // ----- NOTIFY USER IF ALERT TRIGGERED -----
    if (createdResult.alert_triggered) {
      // Fetch the user (for email/notification)
      const user = await User.findByPk(createdResult.user_id);
      if (user) {
        await sendAlertNotification({
          user,
          subscriptionId: createdResult.subscription_id,
          analysisType: createdResult.analysis_type,
          details: createdResult.details,
        });
      }
    }

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
    user_id,
    region_geometry: regionGeoJson,
    alert_categories = [],
    is_active,
    threshold_deforestation,
    threshold_flooding,
    buffer_flooding,
    threshold_glacier,
    buffer_glacier,
    threshold_coastal_erosion,
    threshold_fire_protection, // Add if you want to allow fire alert threshold
    days_back_fire_protection, // Add if you want to allow window customization
    // Add more as needed
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
    `\n--- Processing Active Subscription ID: ${subscriptionId} for User: ${user_id} ---`
  );
  console.log(`   Categories: ${alert_categories.join(", ")}`);

  // --- Category display name to internal key mapping ---
  const categoryKeyMap = {
    DEFORESTATION: "DEFORESTATION",
    FLOODING: "FLOODING",
    GLACIER_MELTING: "GLACIER",
    COASTAL_EROSION: "COASTAL_EROSION",
    FIRE_PROTECTION: "FIRE_PROTECTION",
  };

  // --- Analysis Task Map ---
  const analysisTasks = {
    DEFORESTATION: {
      runner: runDeforestationCheck,
      args: [
        regionGeoJson,
        subscriptionId.toString(),
        credentialsPath,
        threshold_deforestation || -0.1,
      ],
    },
    FLOODING: {
      runner: runFloodingCheck,
      args: [
        regionGeoJson,
        subscriptionId.toString(),
        credentialsPath,
        threshold_flooding || 5.0,
        buffer_flooding || undefined,
      ],
    },
    GLACIER: {
      runner: runGlacierCheck,
      args: [
        regionGeoJson,
        subscriptionId.toString(),
        credentialsPath,
        threshold_glacier || 2.0,
        buffer_glacier || undefined,
      ],
    },
    COASTAL_EROSION: {
      runner: runCoastalErosionCheckWrapper,
      args: [
        regionGeoJson,
        subscriptionId.toString(),
        credentialsPath,
        threshold_coastal_erosion || 5.0,
      ],
    },
    FIRE_PROTECTION: {
      runner: runFireProtectionCheckWrapper,
      args: [
        regionGeoJson,
        subscriptionId.toString(),
        credentialsPath,
        days_back_fire_protection || 1, // Default to last 1 day
      ],
    },
  };

  for (const category of alert_categories) {
    const normCat = normalizeCategory(category);
    const canonical = categoryKeyMap[normCat] || normCat;
    const task = analysisTasks[canonical];
    console.log(`\n   Checking category: ${category}...`);
    if (!task || !task.runner) {
      console.warn(
        `   -> Task/Runner not found/implemented for ${category}. Skipping.`
      );
      continue;
    }

    let analysisResultData = null;
    try {
      console.log(`   -> Running analysis for ${category}...`);
      const result = await task.runner(...task.args);
      console.log(`   --- GEE Check Result (${category}) ---`);
      console.log(JSON.stringify(result, null, 2));

      if (canonical === "DEFORESTATION") {
        analysisResultData = {
          subscription_id: subscriptionId,
          user_id: user_id,
          analysis_type: canonical,
          status: result.status,
          alert_triggered: result.alert_triggered || false,
          calculated_value:
            result.mean_ndvi_change ?? result.calculated_value ?? null,
          threshold_value: result.threshold ?? threshold_deforestation ?? -0.1,
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
      } else if (canonical === "FLOODING") {
        analysisResultData = {
          subscription_id: subscriptionId,
          user_id: user_id,
          analysis_type: canonical,
          status: result.status,
          alert_triggered: result.alert_triggered || false,
          calculated_value: result.flooded_percentage ?? null,
          threshold_value:
            result.threshold_percent ?? threshold_flooding ?? 5.0,
          details: result.message || null,
          recent_period_start: result.recent_period_start || null,
          recent_period_end: result.recent_period_end || null,
          baseline_period_start: result.baseline_period_start || null,
          baseline_period_end: result.baseline_period_end || null,
          buffer_radius_meters: result.buffer_radius_meters || null,
        };
        if (result.status !== "success") {
          delete analysisResultData.recent_period_start;
          delete analysisResultData.recent_period_end;
          delete analysisResultData.baseline_period_start;
          delete analysisResultData.baseline_period_end;
        }
      } else if (canonical === "GLACIER") {
        analysisResultData = {
          subscription_id: subscriptionId,
          user_id: user_id,
          analysis_type: canonical,
          status: result.status,
          alert_triggered: result.alert_triggered || false,
          calculated_value: result.loss_percent ?? null,
          threshold_value: result.threshold_percent ?? threshold_glacier ?? 2.0,
          details: result.message || null,
          recent_period_start: result.recent_period_start || null,
          recent_period_end: result.recent_period_end || null,
          baseline_period_start: result.baseline_period_start || null,
          baseline_period_end: result.baseline_period_end || null,
          buffer_radius_meters: result.buffer_radius_meters || null,
        };
        if (result.status !== "success") {
          delete analysisResultData.recent_period_start;
          delete analysisResultData.recent_period_end;
          delete analysisResultData.baseline_period_start;
          delete analysisResultData.baseline_period_end;
        }
      } else if (canonical === "COASTAL_EROSION") {
        analysisResultData = {
          subscription_id: subscriptionId,
          user_id: user_id,
          analysis_type: canonical,
          status: result.status,
          alert_triggered: result.alert_triggered || false,
          calculated_value: result.shoreline_retreat_meters ?? null,
          threshold_value: result.threshold ?? threshold_coastal_erosion ?? 5.0,
          details: result.message || null,
          recent_period_start: result.recent_period_start || null,
          recent_period_end: result.recent_period_end || null,
          baseline_period_start: result.baseline_period_start || null,
          baseline_period_end: result.baseline_period_end || null,
          buffer_radius_meters: result.buffer_radius_meters || null,
        };
        if (result.status !== "success") {
          delete analysisResultData.recent_period_start;
          delete analysisResultData.recent_period_end;
          delete analysisResultData.baseline_period_start;
          delete analysisResultData.baseline_period_end;
        }
      } else if (canonical === "FIRE_PROTECTION") {
        analysisResultData = {
          subscription_id: subscriptionId,
          user_id: user_id,
          analysis_type: canonical,
          status: result.status,
          alert_triggered: (result.active_fire_count ?? 0) > 0,
          calculated_value: result.active_fire_count ?? null,
          threshold_value: null, // you may add a threshold field if you want to trigger alerts only above a certain count
          details: result.fires
            ? JSON.stringify(result.fires)
            : result.message || null,
          recent_period_start: null,
          recent_period_end: null,
          baseline_period_start: null,
          baseline_period_end: null,
          buffer_radius_meters: null,
        };
      }
    } catch (error) {
      console.error(`   --- Error Running ${category} Check (JS Level) ---`);
      console.error(error.message);
      analysisResultData = {
        subscription_id: subscriptionId,
        user_id: user_id,
        analysis_type: canonical,
        status: "error",
        alert_triggered: false,
        details: `Node.js Orchestration/Runner Error: ${error.message}`,
        threshold_value:
          canonical === "DEFORESTATION"
            ? threshold_deforestation
            : canonical === "FLOODING"
            ? threshold_flooding
            : canonical === "GLACIER"
            ? threshold_glacier
            : canonical === "COASTAL_EROSION"
            ? threshold_coastal_erosion
            : null,
      };
    }

    if (analysisResultData) {
      await saveAnalysisResult(analysisResultData);
    }
  }
  console.log(`--- Finished Processing Subscription ID: ${subscriptionId} ---`);
}

export async function runAllChecks() {
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
        "user_id",
        "region_geometry",
        "alert_categories",
        "is_active",
        "threshold_deforestation",
        "threshold_flooding",
        "buffer_flooding",
        "threshold_glacier",
        "buffer_glacier",
        "threshold_coastal_erosion",
        "threshold_fire_protection", // Add if using fire protection
        "days_back_fire_protection", // Add if using fire protection
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
