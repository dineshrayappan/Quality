import express from "express";
import { getDefects, addCustomDefect, deleteDefect } from "../controllers/defectController.js";

const router = express.Router();

router.get("/", getDefects);
router.post("/custom", addCustomDefect);
router.delete("/:id", deleteDefect);

export default router;
