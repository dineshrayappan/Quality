import express from "express";
import {
  getSummary,
  getDefectPieChart,
  getOperationDefects,
  getHeatmapPoints,
  getHourlyTrend,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/summary", getSummary);
router.get("/defect-pie", getDefectPieChart);
router.get("/operations", getOperationDefects);
router.get("/heatmap", getHeatmapPoints);
router.get("/hourly", getHourlyTrend);

export default router;

