// backend/services/google-earth/flooding.js

import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import fs from "fs";

// --- Calculate __dirname equivalent in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ---

/**
 * Executes the Python GEE flooding detection script.
 * @param {Object} regionGeoJson - GeoJSON object for the region to analyze
 * @param {string} regionId - Identifier for the region
 * @param {string} credentialsPath - Path to GCP credentials file
 * @param {number} [thresholdPercent] - Optional flood alert threshold (percentage of area)
 * @param {number} [bufferMeters] - Optional buffer radius in meters (only applied if geometry is a Point)
 * @returns {Promise<Object>} - Analysis results
 */
function runFloodCheck(
  regionGeoJson,
  regionId,
  credentialsPath,
  thresholdPercent,
  bufferMeters
) {
  return new Promise((resolve, reject) => {
    // --- Configuration ---
    const pythonExecutable = "python"; // Or python3 if needed
    const scriptFilename = "flooding.py"; // The Python script for flooding
    const scriptPath = path.resolve(__dirname, scriptFilename);

    // Verify script exists
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
      credentialsPath, // Credentials path passed as command line argument
    ]);

    // --- Prepare Input Data (for stdin) ---
    const inputData = {
      geometry: regionGeoJson,
      region_id: regionId,
    };

    // Only add threshold_percent if provided and valid
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

    // Only add buffer_meters if provided and valid
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

    // --- Variables/Handlers ---
    let scriptOutput = "";
    let scriptError = "";

    // Handle stdout data
    pythonProcess.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    // Handle stderr data (useful for Python's print statements and errors)
    pythonProcess.stderr.on("data", (data) => {
      const errorMsg = data.toString();
      scriptError += errorMsg;
      // Log stderr immediately for better debugging visibility
      console.error(`Python stderr: ${errorMsg.trim()}`);
    });

    // Handle process close
    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code === 0) {
        try {
          const trimmedOutput = scriptOutput.trim();
          if (!trimmedOutput) {
            // If stderr has content, use that as the error message
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
          // Include stderr in the rejection message if available
          const rejectionErrorMsg = scriptError.trim()
            ? `Failed to parse JSON output: ${
                parseError.message
              }. Stderr: ${scriptError.trim()}`
            : `Failed to parse JSON output: ${parseError.message}`;
          reject(new Error(rejectionErrorMsg));
        }
      } else {
        // Python script failed
        console.error(`Python script failed with exit code ${code}`);
        const rejectionErrorMsg = scriptError.trim()
          ? `Python script failed with code ${code}. Error output: ${scriptError.trim()}`
          : `Python script failed with code ${code}. No specific error message on stderr.`;
        reject(new Error(rejectionErrorMsg));
      }
    });

    // Handle process error (e.g., python command not found)
    pythonProcess.on("error", (err) => {
      console.error("Failed to start Python subprocess:", err);
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });

    // --- Send Input Data to Python Script via stdin ---
    try {
      console.log("Writing input data to Python stdin:", inputJsonString);
      pythonProcess.stdin.write(inputJsonString);
      pythonProcess.stdin.end(); // Close stdin to signal end of input
    } catch (stdinError) {
      console.error("Error writing to Python stdin:", stdinError);
      // Try to kill the process if stdin fails? Maybe not necessary, 'close' event should still fire.
      reject(new Error(`Error writing to Python stdin: ${stdinError.message}`));
    }
  });
}

// --- Example Usage ---
async function main() {
  // Example Point geometry (will be buffered in Python)
  const samplePointGeoJson = {
    type: "Point",
    coordinates: [-95.7, 29.5], // Example coordinates near Houston, TX
  };
  const samplePointRegionId = "houston-test-point-1";
  const customBuffer = 1500; // Custom buffer radius in meters

  // Example Polygon geometry
  const samplePolygonGeoJson = {
    type: "Polygon",
    coordinates: [
      [
        // Lower Mississippi area example
        [-91.2, 30.0],
        [-91.0, 30.0],
        [-91.0, 29.8],
        [-91.2, 29.8],
        [-91.2, 30.0],
      ],
    ],
  };
  const samplePolygonRegionId = "mississippi-test-poly-1";
  const customThresholdPercent = 10.0; // Alert if > 10% flooded

  console.log("--- Starting GEE Flood Check ---");

  // --- Get and Clean Credentials Path ---
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

  // --- Run Check for Polygon ---
  console.log(`\n--- Running Check for Polygon: ${samplePolygonRegionId} ---`);
  try {
    const resultPoly = await runFloodCheck(
      samplePolygonGeoJson,
      samplePolygonRegionId,
      credentialsPath,
      customThresholdPercent // Pass custom threshold
      // No buffer passed for polygon, Python uses default if needed (but won't for polygon)
    );

    console.log("\n--- GEE Polygon Check Result ---");
    console.log(JSON.stringify(resultPoly, null, 2));

    if (resultPoly && resultPoly.status === "success") {
      console.log(
        `Flooded Percentage: ${
          resultPoly.flooded_percentage?.toFixed(2) ?? "N/A"
        }%`
      );
      if (resultPoly.alert_triggered) {
        console.log(
          `\nALERT! Potential flooding detected. Area: ${
            resultPoly.flooded_area_sqkm?.toFixed(2) ?? "N/A"
          } sqkm (${resultPoly.flooded_percentage?.toFixed(2) ?? "N/A"}%)`
        );
      } else {
        console.log(
          `\nNo significant flooding detected above threshold (${resultPoly.threshold_percent}%).`
        );
      }
    } else {
      console.error(
        `\nGEE check failed for polygon: ${
          resultPoly?.message || "Unknown error"
        }`
      );
    }
  } catch (error) {
    console.error("\n--- Error Running Polygon Flood Check ---");
    console.error(error.message);
  }

  // --- Run Check for Point (with buffer) ---
  console.log(`\n--- Running Check for Point: ${samplePointRegionId} ---`);
  try {
    const resultPoint = await runFloodCheck(
      samplePointGeoJson,
      samplePointRegionId,
      credentialsPath,
      null, // Use default threshold
      customBuffer // Pass custom buffer radius
    );

    console.log("\n--- GEE Point Check Result ---");
    console.log(JSON.stringify(resultPoint, null, 2));

    if (resultPoint && resultPoint.status === "success") {
      console.log(
        `Analysis Buffer Radius: ${resultPoint.buffer_radius_meters}m`
      );
      console.log(
        `Flooded Percentage: ${
          resultPoint.flooded_percentage?.toFixed(2) ?? "N/A"
        }%`
      );
      if (resultPoint.alert_triggered) {
        console.log(
          `\nALERT! Potential flooding detected within buffer. Area: ${
            resultPoint.flooded_area_sqkm?.toFixed(2) ?? "N/A"
          } sqkm (${resultPoint.flooded_percentage?.toFixed(2) ?? "N/A"}%)`
        );
      } else {
        console.log(
          `\nNo significant flooding detected above threshold (${resultPoint.threshold_percent}%).`
        );
      }
    } else {
      console.error(
        `\nGEE check failed for point: ${
          resultPoint?.message || "Unknown error"
        }`
      );
    }
  } catch (error) {
    console.error("\n--- Error Running Point Flood Check ---");
    console.error(error.message);
  }

  console.log("\n--- GEE Check Process Finished ---");
}

// Execute the main function if the script is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

// Export the function for potential use as a module
export { runFloodCheck };
