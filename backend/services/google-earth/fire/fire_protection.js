import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import fs from "fs";

// --- Calculate __dirname equivalent in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Executes the Python GEE fire detection script.
 * @param {Object} regionGeoJson - GeoJSON object for the region to analyze
 * @param {string} regionId - Identifier for the region
 * @param {string} credentialsPath - Path to GCP credentials file
 * @param {number} [daysBack] - Optional: how many days back should the fire detection look
 * @returns {Promise<Object>} - Analysis results
 */
function runFireProtectionCheck(
  regionGeoJson,
  regionId,
  credentialsPath,
  daysBack
) {
  return new Promise((resolve, reject) => {
    const pythonExecutable = "python";
    const scriptFilename = "fire_protection.py";
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

    if (daysBack !== undefined && daysBack !== null) {
      inputData.days_back = daysBack;
    }

    const inputJsonString = JSON.stringify(inputData);

    let scriptOutput = "";
    let scriptError = "";

    pythonProcess.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      scriptError += data.toString();
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code === 0) {
        try {
          const trimmedOutput = scriptOutput.trim();

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

export { runFireProtectionCheck };
