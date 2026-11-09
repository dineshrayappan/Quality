import mongoose from "mongoose";

const singleDefectPinSchema = new mongoose.Schema(
  {
    defectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DefectType",
    },
    defectCode: {
      type: String,
      default: "",
    },
    defectName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Stitching",
    },
    operation: {
      type: String,
      default: "General / Not Specified",
    },
    viewName: {
      type: String,
      enum: ["Front", "Back", "Detail", "Collar"],
      default: "Front",
    },
    x: {
      type: Number, // Percentage 0 - 100 on the image canvas
      required: true,
      min: 0,
      max: 100,
    },
    y: {
      type: Number, // Percentage 0 - 100 on the image canvas
      required: true,
      min: 0,
      max: 100,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const inspectionLogSchema = new mongoose.Schema(
  {
    lineName: {
      type: String,
      required: true,
      index: true,
    },
    styleNumber: {
      type: String,
      required: true,
      index: true,
    },
    buyer: {
      type: String,
      default: "",
    },
    inspectorName: {
      type: String,
      default: "QC Inspector",
    },
    status: {
      type: String,
      enum: ["OK", "DEFECT"],
      required: true,
      index: true,
    },
    defects: [singleDefectPinSchema],
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    shift: {
      type: String,
      enum: ["Shift A", "Shift B", "General"],
      default: "General",
    },
  },
  { timestamps: true }
);

export const InspectionLog = mongoose.model("InspectionLog", inspectionLogSchema);

