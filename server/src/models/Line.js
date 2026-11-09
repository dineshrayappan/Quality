import mongoose from "mongoose";

const lineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    supervisor: {
      type: String,
      default: "",
    },
    targetHourly: {
      type: Number,
      default: 80,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Line = mongoose.model("Line", lineSchema);

