import express from "express";
import { logPassPiece, logDefectPiece, logRejectPiece, getRecentLogs, deleteLog } from "../controllers/qcController.js";

const router = express.Router();

router.post("/pass", logPassPiece);
router.post("/defect", logDefectPiece);
router.post("/reject", logRejectPiece);
router.get("/recent", getRecentLogs);
router.delete("/logs/:id", deleteLog);

export default router;
