// controllers/analysisResult.controller.js
import AnalysisResult from "../models/analysisResult.model.js";
import UserSubscription from "../models/userSubscription.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import sequelize from "../db/db.js";

/*
=============================
    Get User's Analysis Results
=============================
*/
export const getUserAnalysisResults = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { analysis_type, alert_triggered } = req.query;

  console.log("Fetching analysis results for user:", userId);
  console.log("Query parameters:", { analysis_type, alert_triggered });

  // Build query conditions
  const whereConditions = { userId };

  if (analysis_type) {
    whereConditions.analysis_type = analysis_type;
  }

  if (alert_triggered !== undefined) {
    whereConditions.alert_triggered = alert_triggered === "true";
  }

  console.log("Where conditions:", whereConditions);

  // Find results
  const results = await AnalysisResult.findAll({
    where: whereConditions,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: UserSubscription,
        attributes: ["id", "name", "region_geometry"],
      },
    ],
  });

  console.log("Found results:", results.length);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        results,
      },
      "Analysis results retrieved successfully"
    )
  );
});

/*
=============================
    Get Analysis Result By ID
=============================
*/
export const getAnalysisResultById = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const result = await AnalysisResult.findOne({
    where: { id, userId },
    include: [
      {
        model: UserSubscription,
        attributes: ["id", "name", "region_geometry"],
      },
    ],
  });

  if (!result) {
    return next(new ApiError("Analysis result not found", 404));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { result }, "Analysis result retrieved successfully")
    );
});

/*
=============================
    Get Results by Subscription
=============================
*/
export const getResultsBySubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { subscriptionId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit;

  // First check if subscription belongs to user
  const subscription = await UserSubscription.findOne({
    where: { id: subscriptionId, userId },
  });

  if (!subscription) {
    return next(new ApiError("Subscription not found", 404));
  }

  // Find results for this subscription
  const results = await AnalysisResult.findAndCountAll({
    where: { subscriptionId },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        results: results.rows,
        totalCount: results.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(results.count / limit),
      },
      "Subscription analysis results retrieved successfully"
    )
  );
});

/*
=============================
    Get Alert Summary
=============================
*/
export const getAlertSummary = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Count total alerts
  const totalAlerts = await AnalysisResult.count({
    where: {
      userId,
      alert_triggered: true,
    },
  });

  // Count by category
  const alertsByCategory = await AnalysisResult.findAll({
    attributes: [
      "analysis_type",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"],
    ],
    where: {
      userId,
      alert_triggered: true,
    },
    group: ["analysis_type"],
  });

  // Get recent alerts
  const recentAlerts = await AnalysisResult.findAll({
    where: {
      userId,
      alert_triggered: true,
    },
    order: [["createdAt", "DESC"]],
    limit: 5,
    include: [
      {
        model: UserSubscription,
        attributes: ["id", "name"],
      },
    ],
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalAlerts,
        alertsByCategory,
        recentAlerts,
      },
      "Alert summary retrieved successfully"
    )
  );
});

// We need to update the AnalysisResult model to include a notification field
// so we can track when notifications have been sent
