import express from "express";
import {
  getUserAnalysisResults,
  getAnalysisResultById,
  getResultsBySubscription,
  getAlertSummary,
  deleteAnalysisResult, // Import the delete controller
} from "../controllers/analysisResult.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// All result routes require authentication
router.use(authMiddleware);

router.route("/").get(getUserAnalysisResults);
router.route("/alert-summary").get(getAlertSummary); // Define static routes first
router
  .route("/:id")
  .get(getAnalysisResultById) // Dynamic routes come next
  .delete(deleteAnalysisResult); // Add DELETE route for deleting analysis results

router.route("/subscription/:subscriptionId").get(getResultsBySubscription);

export default router;
