import "dotenv/config";
import express from "express";
import cors from "cors";
import os from "os";
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
const isVercel = Boolean(process.env.VERCEL);
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/garment_qc_db";

// Ensure uploads folder exists in a writable directory (Vercel deployment dir is read-only)
const uploadsDir = isVercel
  ? path.join(os.tmpdir(), "uploads")
  : path.join(__dirname, "../public/uploads");
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

// Cached database connection for both local runs and serverless cold starts
let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!connectionPromise) {
    mongoose.set("strictQuery", true);
    connectionPromise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((conn) => {
        console.log(`>>> MongoDB connected: ${conn.connection.name}`);
        return conn;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error(">>> MongoDB connection error:", error.message);
        console.log(">>> Ensure MongoDB is running or MONGODB_URI is configured");
        throw error;
      });
  }
  return connectionPromise;
};

// Ensure DB connection is ready before handling API requests on serverless cold starts
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    return next();
  } catch (error) {
    if (req.path === "/health") {
      return next();
    }
    return res.status(503).json({
      error: "Database connection unavailable",
      details: error.message,
    });
  }
});

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

if (!isVercel) {
  connectDB().catch(() => {});

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`====================================================`);
    console.log(` Garment Export End-Line QC Server Running!`);
    console.log(` Port: http://localhost:${PORT}`);
    console.log(` Health: http://localhost:${PORT}/api/health`);
    console.log(` Uploads: http://localhost:${PORT}/uploads`);
    console.log(`====================================================`);
  });
}

export default app;
