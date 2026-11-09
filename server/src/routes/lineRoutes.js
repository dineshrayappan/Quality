import express from "express";
import { getLines, createLine, deleteLine } from "../controllers/lineController.js";

const router = express.Router();

router.get("/", getLines);
router.post("/", createLine);
router.delete("/:id", deleteLine);

export default router;
