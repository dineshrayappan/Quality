import express from "express";
import { logPassPiece, logDefectPiece, getRecentLogs, deleteLog } from "../controllers/qcController.js";

const router = express.Router();

router.post("/pass", logPassPiece);
router.post("/defect", logDefectPiece);
router.get("/recent", getRecentLogs);
router.delete("/logs/:id", deleteLog);

export default router;

