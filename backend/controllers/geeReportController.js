import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { runDeforestationCheck } from "../services/google-earth/deforestation/deforestation.js";
import { runFloodCheck } from "../services/google-earth/flooding/flooding.js";
import { runGlacierMeltingCheck } from "../services/google-earth/glacier/glacier_melting.js";
import { runCoastalErosionCheck } from "../services/google-earth/coastal_erosion/coastal_erosion.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateGEEReport(req, res) {
  try {
    const {
      regionGeoJson,
      regionId,
      analysisType = "DEFORESTATION",
      threshold,
      thresholdPercent,
      bufferMeters,
    } = req.body;

    let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!credentialsPath || !fs.existsSync(credentialsPath)) {
      return res
        .status(500)
        .json({ success: false, error: "GEE credentials not found." });
    }

    let analysisResult = null;
    try {
      switch (analysisType) {
        case "DEFORESTATION":
          analysisResult = await runDeforestationCheck(
            regionGeoJson,
            regionId,
            credentialsPath,
            threshold
          );
          break;
        case "FLOODING":
          analysisResult = await runFloodCheck(
            regionGeoJson,
            regionId,
            credentialsPath,
            thresholdPercent,
            bufferMeters
          );
          break;
        case "GLACIER":
          analysisResult = await runGlacierMeltingCheck(
            regionGeoJson,
            regionId,
            credentialsPath,
            thresholdPercent,
            bufferMeters
          );
          break;
        case "COASTAL_EROSION":
          analysisResult = await runCoastalErosionCheck(
            regionGeoJson,
            regionId,
            credentialsPath,
            threshold
          );
          break;
        default:
          return res
            .status(400)
            .json({ success: false, error: "Unknown analysis type." });
      }
      // If the result is empty (e.g. python returned empty), ensure a fallback object:
      if (!analysisResult) {
        analysisResult = {
          status: "error",
          message: "No result returned from analysis.",
          alert_triggered: false,
        };
      }
    } catch (err) {
      analysisResult = {
        status: "error",
        message: err.message || `Unknown error in ${analysisType} analysis.`,
        alert_triggered: false,
      };
    }

    // Ensure images are present if returned by service, else null
    const start_image_url =
      analysisResult && analysisResult.start_image_url
        ? analysisResult.start_image_url
        : null;
    const end_image_url =
      analysisResult && analysisResult.end_image_url
        ? analysisResult.end_image_url
        : null;

    // Always respond with valid JSON, including images if available
    return res.json({
      success: true,
      result: {
        ...analysisResult,
        start_image_url,
        end_image_url,
      },
    });
  } catch (err) {
    console.error("Error generating report:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
