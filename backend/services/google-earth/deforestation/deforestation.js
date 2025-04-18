// deforestation.js (Corrected)

import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import fs from "fs";

// --- Calculate __dirname equivalent in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ---

/**
 * Executes the Python GEE deforestation script.
 * @param {Object} regionGeoJson - GeoJSON object for the region to analyze
 * @param {string} regionId - Identifier for the region
 * @param {string} credentialsPath - Path to GCP credentials file
 * @param {number} [threshold] - Optional NDVI drop threshold
 * @returns {Promise<Object>} - Analysis results
 */
function runDeforestationCheck(
  regionGeoJson,
  regionId,
  credentialsPath,
  threshold
) {
  return new Promise((resolve, reject) => {
    // --- Configuration ---
    const pythonExecutable = "python";
    // Fix: Use more reliable path resolution for the Python script
    // We assume the Python script is in the same directory
    const scriptFilename = "deforestation.py";
    const scriptPath = path.resolve(__dirname, scriptFilename);

    // Verify script exists before attempting to run it
    if (!fs.existsSync(scriptPath)) {
      return reject(
        new Error(`Python script not found at path: ${scriptPath}`)
      );
    }

    console.log(`Executing Python script: ${scriptPath}`);
    console.log(`For region: ${regionId}`);
    console.log(`Passing credentials path: ${credentialsPath}`);

    // --- Spawn Python Process ---
    const pythonProcess = spawn(pythonExecutable, [
      scriptPath,
      credentialsPath,
    ]);

    // --- Prepare Input Data (for stdin) ---
    const inputData = {
      geometry: regionGeoJson,
      region_id: regionId,
    };

    // Only add threshold if provided
    if (threshold !== undefined && threshold !== null) {
      inputData.threshold = threshold;
    }

    const inputJsonString = JSON.stringify(inputData);

    // --- Variables/Handlers ---
    let scriptOutput = "";
    let scriptError = "";

    // Handle stdout data
    pythonProcess.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    // Handle stderr data
    pythonProcess.stderr.on("data", (data) => {
      scriptError += data.toString();
      console.error(`Python stderr: ${data}`);
    });

    // Handle process close
    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code === 0) {
        try {
          // Trim output to avoid parsing issues with leading/trailing whitespace
          const trimmedOutput = scriptOutput.trim();

          // Handle empty output
          if (!trimmedOutput) {
            return reject(new Error("Python script returned empty output"));
          }

          const result = JSON.parse(trimmedOutput);
          console.log("Successfully parsed Python output.");
          resolve(result);
        } catch (parseError) {
          console.error("Failed to parse Python JSON output:", parseError);
          console.error("Raw Python output:", scriptOutput);
          reject(
            new Error(`Failed to parse JSON output: ${parseError.message}`)
          );
        }
      } else {
        console.error(`Python script failed with exit code ${code}`);
        reject(
          new Error(
            `Python script failed with code ${code}. Error output: ${scriptError}`
          )
        );
      }
    });

    // Handle process error
    pythonProcess.on("error", (err) => {
      console.error("Failed to start Python subprocess:", err);
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });

    // --- Send Input Data to Python Script via stdin ---
    try {
      console.log("Writing input data to Python stdin:", inputJsonString);
      pythonProcess.stdin.write(inputJsonString);
      pythonProcess.stdin.end();
    } catch (stdinError) {
      console.error("Error writing to Python stdin:", stdinError);
      reject(new Error(`Error writing to Python stdin: ${stdinError.message}`));
    }
  });
}

// --- Example Usage ---
async function main() {
  const sampleRegionGeoJson = {
    type: "Polygon",
    coordinates: [
      [
        [-55.0, -10.0],
        [-54.0, -10.0],
        [-54.0, -11.0],
        [-55.0, -11.0],
        [-55.0, -10.0],
      ],
    ],
  };
  const sampleRegionId = "amazon-test-area-1";
  const customThreshold = -0.08;

  console.log("--- Starting GEE Deforestation Check ---");

  // --- Get and Correctly Clean Credentials Path ---
  const rawCredentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!rawCredentialsPath) {
    console.error(
      "\nERROR: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set."
    );
    process.exit(1);
  }
  console.log(`Raw credentials path from env: ${rawCredentialsPath}`);

  // Enhanced path cleaning - handle both double and single quotes
  let credentialsPath = rawCredentialsPath.trim();
  if (
    (credentialsPath.startsWith('"') && credentialsPath.endsWith('"')) ||
    (credentialsPath.startsWith("'") && credentialsPath.endsWith("'"))
  ) {
    credentialsPath = credentialsPath.substring(1, credentialsPath.length - 1);
  }

  // Verify credentials file exists
  if (!fs.existsSync(credentialsPath)) {
    console.error(`\nERROR: Credentials file not found at: ${credentialsPath}`);
    process.exit(1);
  }

  console.log(`Using credentials file (cleaned path): ${credentialsPath}`);

  try {
    const result = await runDeforestationCheck(
      sampleRegionGeoJson,
      sampleRegionId,
      credentialsPath,
      customThreshold
    );

    console.log("\n--- GEE Check Result ---");
    console.log(JSON.stringify(result, null, 2));

    if (result && result.status === "success") {
      if (result.alert_triggered) {
        console.log(
          `\nALERT! Significant NDVI drop detected (${result.mean_ndvi_change.toFixed(
            4
          )}). This suggests potential deforestation in the region.`
        );
      } else {
        console.log(
          `\nNo significant deforestation detected. NDVI change: ${result.mean_ndvi_change.toFixed(
            4
          )}`
        );
      }
    } else {
      console.error(
        `\nGEE check failed: ${result?.message || "Unknown error"}`
      );
    }
  } catch (error) {
    console.error("\n--- Error Running Deforestation Check ---");
    console.error(error.message);
  } finally {
    console.log("\n--- GEE Check Process Finished ---");
  }
}

main();
