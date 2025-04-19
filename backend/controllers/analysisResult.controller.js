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

  console.log("[DEBUG] Fetching analysis results for user:", userId);
  console.log("[DEBUG] Query parameters:", { analysis_type, alert_triggered });

  // Build query conditions
  const whereConditions = { user_id: userId };

  if (analysis_type) {
    whereConditions.analysis_type = analysis_type;
  }

  if (alert_triggered !== undefined) {
    whereConditions.alert_triggered = alert_triggered === "true";
  }

  console.log("[DEBUG] Where conditions:", whereConditions);

  // Find results
  const results = await AnalysisResult.findAll({
    where: whereConditions,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: UserSubscription,
        attributes: ["id", "subscription_name", "region_geometry"],
      },
    ],
  });

  console.log("[DEBUG] Found results:", results.length);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { results },
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

  console.log("[DEBUG] Fetching analysis result by ID:", id);
  console.log("[DEBUG] User ID:", userId);

  const result = await AnalysisResult.findOne({
    where: { id, user_id: userId },
    include: [
      {
        model: UserSubscription,
        attributes: ["id", "subscription_name", "region_geometry"],
      },
    ],
  });

  if (!result) {
    console.error("[ERROR] Analysis result not found for ID:", id);
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
    Delete Analysis Result
=============================
*/
export const deleteAnalysisResult = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  console.log("[DEBUG] Deleting analysis result by ID:", id);
  console.log("[DEBUG] User ID:", userId);

  const result = await AnalysisResult.findOne({
    where: { id, user_id: userId },
  });

  if (!result) {
    console.error("[ERROR] Analysis result not found for ID:", id);
    return next(new ApiError("Analysis result not found", 404));
  }

  // Delete the analysis result
  await result.destroy();

  console.log("[DEBUG] Analysis result deleted successfully for ID:", id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Analysis result deleted successfully"));
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

  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  console.log("[DEBUG] Fetching results by subscription:", subscriptionId);
  console.log("[DEBUG] Pagination - Page:", page, "Limit:", limit);

  // Validate subscription
  const subscription = await UserSubscription.findOne({
    where: { id: subscriptionId, user_id: userId },
  });

  if (!subscription) {
    console.error("[ERROR] Subscription not found for ID:", subscriptionId);
    return next(new ApiError("Subscription not found", 404));
  }

  // Find results for this subscription
  const results = await AnalysisResult.findAndCountAll({
    where: { subscription_id: subscriptionId },
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [["createdAt", "DESC"]],
  });

  console.log("[DEBUG] Found results:", results.rows.length);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        results: results.rows,
        totalCount: results.count,
        currentPage: parseInt(page, 10),
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

  console.log("[DEBUG] Fetching alert summary for user:", userId);

  // Validate userId
  if (!userId || isNaN(userId)) {
    console.error("[ERROR] Invalid user ID:", userId);
    return next(new ApiError("Invalid user ID", 400));
  }

  // Count total alerts
  const totalAlerts = await AnalysisResult.count({
    where: {
      user_id: userId,
      alert_triggered: true,
    },
  });

  console.log("[DEBUG] Total alerts:", totalAlerts);

  // Count by category
  const alertsByCategory = await AnalysisResult.findAll({
    attributes: [
      "analysis_type",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"],
    ],
    where: {
      user_id: userId,
      alert_triggered: true,
    },
    group: ["analysis_type"],
  });

  console.log("[DEBUG] Alerts by category:", alertsByCategory);

  // Get recent alerts
  const recentAlerts = await AnalysisResult.findAll({
    where: {
      user_id: userId,
      alert_triggered: true,
    },
    order: [["createdAt", "DESC"]],
    limit: 5,
    include: [
      {
        model: UserSubscription,
        attributes: ["id", "subscription_name"],
      },
    ],
  });

  console.log("[DEBUG] Recent alerts:", recentAlerts.length);

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
