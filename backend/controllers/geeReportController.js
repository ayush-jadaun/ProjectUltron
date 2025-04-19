import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { runDeforestationCheck } from "../services/google-earth/deforestation/deforestation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateGEEReport(req, res) {
  try {
    const {
      regionGeoJson,
      regionId,
      analysisType = "DEFORESTATION",
      threshold,
    } = req.body;

    let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!credentialsPath || !fs.existsSync(credentialsPath)) {
      return res
        .status(500)
        .json({ success: false, error: "GEE credentials not found." });
    }

    let analysisResult = null;
    if (analysisType === "DEFORESTATION") {
      try {
        analysisResult = await runDeforestationCheck(
          regionGeoJson,
          regionId,
          credentialsPath,
          threshold
        );
        // If the result is empty (e.g. python returned empty), ensure a fallback object:
        if (!analysisResult) {
          analysisResult = {
            status: "error",
            message: "No result returned from analysis.",
            alert_triggered: false,
          };
        }
      } catch (err) {
        // Catches all JS-rejected errors or thrown errors from the Promise
        analysisResult = {
          status: "error",
          message: err.message || "Unknown error in deforestation analysis.",
          alert_triggered: false,
        };
      }
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Unknown analysis type." });
    }

    // Always respond with valid JSON
    return res.json({ success: true, result: analysisResult });
  } catch (err) {
    console.error("Error generating report:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
