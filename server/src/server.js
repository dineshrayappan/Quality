import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import qcRoutes from "./routes/qcRoutes.js";
import defectRoutes from "./routes/defectRoutes.js";
import techpackRoutes from "./routes/techpackRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import lineRoutes from "./routes/lineRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/garment_qc_db";

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares with high payload limit for garment images / sketches
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static assets (garment SVGs, uploaded techpack images)
app.use("/techpacks", express.static(path.join(__dirname, "../public/techpacks")));
app.use("/uploads", express.static(uploadsDir));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Garment End-line QC API",
    dbState: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date(),
  });
});

// Routes
app.use("/api/qc", qcRoutes);
app.use("/api/defects", defectRoutes);
app.use("/api/techpacks", techpackRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/lines", lineRoutes);

// Database Connection (Direct database operations, no auto-seed data)
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`>>> MongoDB connected: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(">>> MongoDB connection error:", error.message);
    console.log(">>> Ensure MongoDB is running on mongodb://127.0.0.1:27017");
  }
};

connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`====================================================`);
  console.log(` Garment Export End-Line QC Server Running!`);
  console.log(` Port: http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(` Uploads: http://localhost:${PORT}/uploads`);
  console.log(`====================================================`);
});
