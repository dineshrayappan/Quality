import mongoose from "mongoose";

const defectTypeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      en: { type: String, required: true, trim: true },
      ta: { type: String, default: "", trim: true },
      hi: { type: String, default: "", trim: true },
      or: { type: String, default: "", trim: true },
    },
    category: {
      type: String,
      enum: ["Stitching", "Fabric", "Stain / Soil", "Trims / Accessories", "Measurement", "Ironing / Packing", "Other"],
      default: "Stitching",
    },
    severity: {
      type: String,
      enum: ["Minor", "Major", "Critical"],
      default: "Major",
    },
    isCustom: {
      type: Boolean,
      default: false, // true if added manually by inspector
    },
    active: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: String,
      default: "System",
    },
  },
  { timestamps: true }
);

export const DefectType = mongoose.model("DefectType", defectTypeSchema);

