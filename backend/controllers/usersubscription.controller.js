import UserSubscription from "../models/userSubscription.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
=============================
    Create Subscription
=============================
*/
export const createSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    subscription_name,
    region_name,
    region_geometry,
    alert_categories,
    threshold_deforestation,
    threshold_flooding,
    buffer_flooding,
    threshold_glacier,
    buffer_glacier,
    threshold_coastal_erosion,
    is_active,
  } = req.body;

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
  if (!region_geometry.type || !region_geometry.coordinates) {
    return next(
      new ApiError("Invalid GeoJSON format for region geometry", 400)
    );
  }

  try {
    // Create
    const subscription = await UserSubscription.create({
      userId,
      subscription_name: subscription_name || `Subscription ${Date.now()}`,
      region_name,
      region_geometry,
      alert_categories,
      threshold_deforestation: threshold_deforestation ?? null,
      threshold_flooding: threshold_flooding ?? null,
      buffer_flooding: buffer_flooding ?? null,
      threshold_glacier: threshold_glacier ?? null,
      buffer_glacier: buffer_glacier ?? null,
      threshold_coastal_erosion: threshold_coastal_erosion ?? null,
      is_active: is_active !== undefined ? is_active : true,
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
  } catch (err) {
    console.error("Create Subscription Error:", err); // for debugging
    return next(new ApiError(err.message, 500));
  }
});

/*
=============================
    Get User Subscriptions
=============================
*/
export const getUserSubscriptions = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
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
    where: { id, userId },
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
  const {
    subscription_name,
    region_name,
    region_geometry,
    alert_categories,
    threshold_deforestation,
    threshold_flooding,
    buffer_flooding,
    threshold_glacier,
    buffer_glacier,
    threshold_coastal_erosion,
    is_active,
  } = req.body;

  const subscription = await UserSubscription.findOne({
    where: { id, userId },
  });
  if (!subscription) {
    return next(new ApiError("Subscription not found", 404));
  }

  // Only update provided fields
  if (subscription_name !== undefined)
    subscription.subscription_name = subscription_name;
  if (region_name !== undefined) subscription.region_name = region_name;
  if (region_geometry !== undefined)
    subscription.region_geometry = region_geometry;
  if (alert_categories !== undefined && Array.isArray(alert_categories))
    subscription.alert_categories = alert_categories;
  if (threshold_deforestation !== undefined)
    subscription.threshold_deforestation = threshold_deforestation;
  if (threshold_flooding !== undefined)
    subscription.threshold_flooding = threshold_flooding;
  if (buffer_flooding !== undefined)
    subscription.buffer_flooding = buffer_flooding;
  if (threshold_glacier !== undefined)
    subscription.threshold_glacier = threshold_glacier;
  if (buffer_glacier !== undefined)
    subscription.buffer_glacier = buffer_glacier;
  if (threshold_coastal_erosion !== undefined)
    subscription.threshold_coastal_erosion = threshold_coastal_erosion;
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
