import { InspectionLog } from "../models/InspectionLog.js";

// Rapid log for good / passed piece
export const logPassPiece = async (req, res) => {
  try {
    const { lineName, styleNumber, buyer, inspectorName, shift } = req.body;

    if (!lineName || !styleNumber) {
      return res.status(400).json({ error: "lineName and styleNumber are required" });
    }

    const log = new InspectionLog({
      lineName,
      styleNumber,
      buyer: buyer || "",
      inspectorName: inspectorName || "QC Inspector",
      status: "OK",
      defects: [],
      shift: shift || "General",
      timestamp: new Date(),
    });

    await log.save();

    res.status(201).json({
      success: true,
      message: "Piece marked OK",
      logId: log._id,
      timestamp: log.timestamp,
    });
  } catch (error) {
    console.error("Error logging OK piece:", error);
    res.status(500).json({ error: error.message });
  }
};

// Log a defect / rework piece with pinpoint coordinates and defect types
export const logDefectPiece = async (req, res) => {
  try {
    const { lineName, styleNumber, buyer, inspectorName, shift, defects, status } = req.body;

    if (!lineName || !styleNumber) {
      return res.status(400).json({ error: "lineName and styleNumber are required" });
    }

    if (!Array.isArray(defects) || defects.length === 0) {
      return res.status(400).json({ error: "At least one defect must be selected" });
    }

    const formattedDefects = defects.map((d) => ({
      defectId: d.defectId || null,
      defectCode: d.defectCode || "",
      defectName: d.defectName || "Unspecified Defect",
      category: d.category || "Stitching",
      operation: d.operation || "General / Not Specified",
      viewName: d.viewName || "Front",
      x: typeof d.x === "number" ? Math.min(100, Math.max(0, d.x)) : 50,
      y: typeof d.y === "number" ? Math.min(100, Math.max(0, d.y)) : 50,
      notes: d.notes || "",
    }));

    const finalStatus = (status === "REJECT" || status === "REJECTED") ? "REJECT" : "DEFECT";

    const log = new InspectionLog({
      lineName,
      styleNumber,
      buyer: buyer || "",
      inspectorName: inspectorName || "QC Inspector",
      status: finalStatus,
      defects: formattedDefects,
      shift: shift || "General",
      timestamp: new Date(),
    });

    await log.save();

    res.status(201).json({
      success: true,
      message: finalStatus === "REJECT" ? "Piece marked as Permanent Rejection (Scrap)" : "Defect logged and piece sent to rework",
      logId: log._id,
      status: finalStatus,
      defectsCount: formattedDefects.length,
      timestamp: log.timestamp,
    });
  } catch (error) {
    console.error("Error logging defect piece:", error);
    res.status(500).json({ error: error.message });
  }
};

// Dedicated log for Rejected / Scrap piece
export const logRejectPiece = async (req, res) => {
  req.body.status = "REJECT";
  return logDefectPiece(req, res);
};

// Get recent inspection logs with date range and status filters
export const getRecentLogs = async (req, res) => {
  try {
    const { lineName, styleNumber, status, fromDate, toDate, startDate, endDate, limit = 50 } = req.query;
    const filter = {};

    if (lineName && lineName !== "All") filter.lineName = lineName;
    if (styleNumber && styleNumber !== "All") filter.styleNumber = styleNumber;
    if (status && status !== "All") filter.status = status;

    const from = fromDate || startDate;
    const to = toDate || endDate;

    if (from || to) {
      filter.timestamp = {};
      if (from) {
        const s = new Date(from);
        s.setHours(0, 0, 0, 0);
        filter.timestamp.$gte = s;
      }
      if (to) {
        const e = new Date(to);
        e.setHours(23, 59, 59, 999);
        filter.timestamp.$lte = e;
      }
    }

    const logs = await InspectionLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit, 10));

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete last log (Undo action)
export const deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await InspectionLog.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Log not found" });
    }
    res.json({ success: true, message: "Inspection log reverted", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
