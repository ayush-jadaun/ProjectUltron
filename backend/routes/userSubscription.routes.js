import express from "express";
import {
  createSubscription,
  getUserSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} from "../controllers/usersubscription.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
  .post(createSubscription)
  .get(getUserSubscriptions);

router
  .route("/:id")
  .get(getSubscriptionById)
  .put(updateSubscription)
  .delete(deleteSubscription);

export default router;
