// controllers/userSubscription.controller.js
import UserSubscription from "../models/userSubscription.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
=============================
    Create Subscription
=============================
*/
export const createSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // From auth middleware
  const { subscription_name, region_geometry, alert_categories } = req.body;

  // Validation
  if (
    !region_geometry ||
    !Array.isArray(alert_categories) ||
    alert_categories.length === 0
  ) {
    return next(
      new ApiError(
        "Region geometry and at least one alert category are required",
        400
      )
    );
  }

  // Optional: validate GeoJSON structure
  if (!region_geometry.type || !region_geometry.coordinates) {
    return next(
      new ApiError("Invalid GeoJSON format for region geometry", 400)
    );
  }

  // Create subscription
  const subscription = await UserSubscription.create({
    userId,
    subscription_name: subscription_name || `Subscription ${Date.now()}`,
    region_geometry,
    alert_categories,
    is_active: true,
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { subscription },
        "Subscription created successfully"
      )
    );
});

/*
=============================
    Get User Subscriptions
=============================
*/
export const getUserSubscriptions = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // From auth middleware

  const subscriptions = await UserSubscription.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscriptions },
        "User subscriptions retrieved successfully"
      )
    );
});

/*
=============================
    Get Subscription By ID
=============================
*/
export const getSubscriptionById = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const subscription = await UserSubscription.findOne({
    where: { id, userId }, // Ensure user only accesses their own subscriptions
  });

  if (!subscription) {
    return next(new ApiError("Subscription not found", 404));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscription },
        "Subscription retrieved successfully"
      )
    );
});

/*
=============================
    Update Subscription
=============================
*/
export const updateSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { subscription_name, region_geometry, alert_categories, is_active } =
    req.body;

  const subscription = await UserSubscription.findOne({
    where: { id, userId },
  });

  if (!subscription) {
    return next(new ApiError("Subscription not found", 404));
  }

  // Update fields if provided
  if (subscription_name !== undefined)
    subscription.subscription_name = subscription_name;
  if (region_geometry !== undefined)
    subscription.region_geometry = region_geometry;
  if (alert_categories !== undefined && Array.isArray(alert_categories)) {
    subscription.alert_categories = alert_categories;
  }
  if (is_active !== undefined) subscription.is_active = Boolean(is_active);

  await subscription.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscription },
        "Subscription updated successfully"
      )
    );
});

/*
=============================
    Delete Subscription
=============================
*/
export const deleteSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const subscription = await UserSubscription.findOne({
    where: { id, userId },
  });

  if (!subscription) {
    return next(new ApiError("Subscription not found", 404));
  }

  await subscription.destroy();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Subscription deleted successfully"));
});
