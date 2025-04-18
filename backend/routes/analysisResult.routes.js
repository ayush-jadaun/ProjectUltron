import express from "express";
import {
  getUserAnalysisResults,
  getAnalysisResultById,
  getResultsBySubscription,
  getAlertSummary,
} from "../controllers/analysisResult.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// All result routes require authentication
router.use(authMiddleware);

router.route("/").get(getUserAnalysisResults);

router.route("/summary").get(getAlertSummary);

router.route("/:id").get(getAnalysisResultById);

router.route("/subscription/:subscriptionId").get(getResultsBySubscription);

export default router;
