import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import  {runDeforestationCheck } from "../services/google-earth/deforestation/deforestation.js";
// (Import other analysis runners if needed: flooding, glacier, etc.)

// __dirname polyfill for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateGEEReport(req, res) {
  try {
    // 1. Extract user inputs from body (regionGeoJson, regionId, threshold, etc.)
    const {
      regionGeoJson,
      regionId,
      analysisType = "DEFORESTATION",
      threshold,
      // Optionally add more input fields (dates, buffer, etc.)
    } = req.body;

    // 2. Get GCP credentials path from env or config
    let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!credentialsPath || !fs.existsSync(credentialsPath)) {
      return res.status(500).json({ error: "GEE credentials not found." });
    }

    // 3. Run the appropriate GEE analysis
    let analysisResult;
    if (analysisType === "DEFORESTATION") {
      analysisResult = await runDeforestationCheck(
        regionGeoJson,
        regionId,
        credentialsPath,
        threshold
      );
    } else {
      return res.status(400).json({ error: "Unknown analysis type." });
    }

    // 4. Optionally: Save result to DB, or render a PDF report, etc.
    return res.json({ success: true, result: analysisResult });
  } catch (err) {
    console.error("Error generating report:", err);
    return res.status(500).json({ error: err.message });
  }
}
