import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  getTechPacks,
  getTechPackByStyle,
  createTechPack,
  updateTechPack,
  deleteTechPack,
  uploadTechPackImage,
} from "../controllers/techpackController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../public/uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    const uniqueName = `techpack-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

const router = express.Router();

router.get("/", getTechPacks);
router.get("/:styleNumber", getTechPackByStyle);
router.post("/", createTechPack);
router.put("/:id", updateTechPack);
router.delete("/:id", deleteTechPack);
router.post("/upload-image", upload.single("image"), uploadTechPackImage);

export default router;
