import mongoose from "mongoose";

const techPackSchema = new mongoose.Schema(
  {
    styleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    buyer: {
      type: String,
      required: true,
      trim: true,
    },
    itemType: {
      type: String,
      default: "T-Shirt Crew Neck",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    season: {
      type: String,
      default: "SS-2026",
    },
    orderQty: {
      type: Number,
      default: 5000,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    views: [
      {
        viewName: {
          type: String,
          default: "Front",
        },
        imageUrl: {
          type: String,
          required: true,
        },
      },
    ],
    operations: [
      {
        code: { type: String, required: true },
        name: {
          en: { type: String, required: true },
          ta: { type: String, default: "" },
          hi: { type: String, default: "" },
          or: { type: String, default: "" },
        },
        department: { type: String, default: "Sewing" },
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const TechPack = mongoose.model("TechPack", techPackSchema);

