import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import fs from "fs";

// --- Calculate __dirname equivalent in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Executes the Python GEE glacier melting detection script.
 * @param {Object} regionGeoJson - GeoJSON object for the region to analyze
 * @param {string} regionId - Identifier for the region
 * @param {string} credentialsPath - Path to GCP credentials file
 * @param {number} [thresholdPercent] - Optional glacier loss alert threshold (percentage of area)
 * @param {number} [bufferMeters] - Optional buffer radius in meters (only applied if geometry is a Point)
 * @returns {Promise<Object>} - Analysis results
 */
function runGlacierMeltingCheck(
  regionGeoJson,
  regionId,
  credentialsPath,
  thresholdPercent,
  bufferMeters
) {
  return new Promise((resolve, reject) => {
    const pythonExecutable = "python";
    const scriptFilename = "glacier_melting.py";
    const scriptPath = path.resolve(__dirname, scriptFilename);

    if (!fs.existsSync(scriptPath)) {
      return reject(
        new Error(`Python script not found at path: ${scriptPath}`)
      );
    }

    console.log(`Executing Python script: ${scriptPath}`);
    console.log(`For region: ${regionId}`);
    console.log(`Passing credentials path: ${credentialsPath}`);

    const pythonProcess = spawn(pythonExecutable, [
      scriptPath,
      credentialsPath,
    ]);

    const inputData = {
      geometry: regionGeoJson,
      region_id: regionId,
    };

    if (
      thresholdPercent !== undefined &&
      thresholdPercent !== null &&
      !isNaN(parseFloat(thresholdPercent))
    ) {
      inputData.threshold_percent = parseFloat(thresholdPercent);
      console.log(`Using custom threshold: ${inputData.threshold_percent}%`);
    } else {
      console.log(`Using default threshold defined in Python script.`);
    }

    if (
      bufferMeters !== undefined &&
      bufferMeters !== null &&
      !isNaN(parseInt(bufferMeters))
    ) {
      inputData.buffer_meters = parseInt(bufferMeters);
      console.log(
        `Using buffer radius for points: ${inputData.buffer_meters}m`
      );
    } else {
      console.log(`Using default point buffer defined in Python script.`);
    }

    const inputJsonString = JSON.stringify(inputData);

    let scriptOutput = "";
    let scriptError = "";

    pythonProcess.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      const errorMsg = data.toString();
      scriptError += errorMsg;
      console.error(`Python stderr: ${errorMsg.trim()}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code === 0) {
        try {
          const trimmedOutput = scriptOutput.trim();
          if (!trimmedOutput) {
            if (scriptError.trim()) {
              return reject(
                new Error(
                  `Python script returned empty stdout but had stderr output: ${scriptError.trim()}`
                )
              );
            }
            return reject(new Error("Python script returned empty output"));
          }

          const result = JSON.parse(trimmedOutput);
          console.log("Successfully parsed Python JSON output.");
          resolve(result);
        } catch (parseError) {
          console.error("Failed to parse Python JSON output:", parseError);
          console.error("Raw Python stdout:", scriptOutput);
          const rejectionErrorMsg = scriptError.trim()
            ? `Failed to parse JSON output: ${
                parseError.message
              }. Stderr: ${scriptError.trim()}`
            : `Failed to parse JSON output: ${parseError.message}`;
          reject(new Error(rejectionErrorMsg));
        }
      } else {
        console.error(`Python script failed with exit code ${code}`);
        const rejectionErrorMsg = scriptError.trim()
          ? `Python script failed with code ${code}. Error output: ${scriptError.trim()}`
          : `Python script failed with code ${code}. No specific error message on stderr.`;
        reject(new Error(rejectionErrorMsg));
      }
    });

    pythonProcess.on("error", (err) => {
      console.error("Failed to start Python subprocess:", err);
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });

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
  const samplePolygonGeoJson = {
    type: "Polygon",
    coordinates: [
      [
        [-73.0, -49.0], // Example: part of South Patagonian Ice Field
        [-72.8, -49.0],
        [-72.8, -49.2],
        [-73.0, -49.2],
        [-73.0, -49.0],
      ],
    ],
  };
  const samplePolygonRegionId = "patagonia-glacier-test-1";
  const customThresholdPercent = 5.0; // Alert if > 5% glacier loss

  console.log("--- Starting GEE Glacier Melting Check ---");

  const rawCredentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!rawCredentialsPath) {
    console.error(
      "\nERROR: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set."
    );
    process.exit(1);
  }
  console.log(`Raw credentials path from env: ${rawCredentialsPath}`);

  let credentialsPath = rawCredentialsPath.trim();
  if (
    (credentialsPath.startsWith('"') && credentialsPath.endsWith('"')) ||
    (credentialsPath.startsWith("'") && credentialsPath.endsWith("'"))
  ) {
    credentialsPath = credentialsPath.substring(1, credentialsPath.length - 1);
  }

  if (!fs.existsSync(credentialsPath)) {
    console.error(`\nERROR: Credentials file not found at: ${credentialsPath}`);
    process.exit(1);
  }
  console.log(`Using credentials file (cleaned path): ${credentialsPath}`);

  try {
    const result = await runGlacierMeltingCheck(
      samplePolygonGeoJson,
      samplePolygonRegionId,
      credentialsPath,
      customThresholdPercent
    );

    console.log("\n--- GEE Glacier Melting Check Result ---");
    console.log(JSON.stringify(result, null, 2));

    if (result && result.status === "success") {
      console.log(
        `Glacier Loss Percentage: ${result.loss_percent?.toFixed(2) ?? "N/A"}%`
      );
      if (result.alert_triggered) {
        console.log(
          `\nALERT! Significant glacier shrinkage detected: ${
            result.loss_percent?.toFixed(2) ?? "N/A"
          }%`
        );
      } else {
        console.log(
          `\nNo significant glacier melting detected above threshold (${result.threshold_percent}%).`
        );
      }
    } else {
      console.error(
        `\nGEE check failed for glacier region: ${
          result?.message || "Unknown error"
        }`
      );
    }
  } catch (error) {
    console.error("\n--- Error Running Glacier Melting Check ---");
    console.error(error.message);
  }

  console.log("\n--- GEE Glacier Melting Check Process Finished ---");
}

// Execute the main function if the script is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

// Export the function for potential use as a module
export { runGlacierMeltingCheck };
