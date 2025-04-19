import express from "express";
import { generateGEEReport } from "../controllers/geeReportController.js";
const router = express.Router();

router.post("/generate", generateGEEReport);

export default router;
