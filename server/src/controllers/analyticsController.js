import { InspectionLog } from "../models/InspectionLog.js";

// Helper to build date and filter query
const buildDateFilter = (query) => {
  const { date, lineName, styleNumber, startDate, endDate } = query;
  const filter = {};

  if (lineName && lineName !== "All") {
    filter.lineName = lineName;
  }

  if (styleNumber && styleNumber !== "All") {
    filter.styleNumber = styleNumber;
  }

  if (date) {
    // Specific date (YYYY-MM-DD)
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.timestamp = { $gte: start, $lte: end };
  } else if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) {
      const s = new Date(startDate);
      s.setHours(0, 0, 0, 0);
      filter.timestamp.$gte = s;
    }
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      filter.timestamp.$lte = e;
    }
  } else {
    // Default: Today's date (00:00 to 23:59)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    filter.timestamp = { $gte: todayStart, $lte: todayEnd };
  }

  return filter;
};

// Summary metrics: Total inspected, Good / Passed, Defect / Rework, Pass %, Defect %
export const getSummary = async (req, res) => {
  try {
    const filter = buildDateFilter(req.query);

    const logs = await InspectionLog.find(filter);

    const totalInspected = logs.length;
    const goodPieces = logs.filter((l) => l.status === "OK").length;
    const reworkPieces = logs.filter((l) => l.status === "DEFECT").length;

    let totalDefectSpots = 0;
    logs.forEach((l) => {
      if (l.defects) totalDefectSpots += l.defects.length;
    });

    const passRate = totalInspected > 0 ? ((goodPieces / totalInspected) * 100).toFixed(1) : 0;
    const reworkRate = totalInspected > 0 ? ((reworkPieces / totalInspected) * 100).toFixed(1) : 0;

    res.json({
      filterApplied: req.query,
      totalInspected,
      goodPieces,
      reworkPieces,
      totalDefectSpots,
      passRate: Number(passRate),
      reworkRate: Number(reworkRate),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pie chart distribution for defects (includes all standard and manually added custom defects)
export const getDefectPieChart = async (req, res) => {
  try {
    const filter = buildDateFilter(req.query);
    filter.status = "DEFECT";

    const defectLogs = await InspectionLog.find(filter);

    const defectCounts = {};
    const categoryCounts = {};
    let totalDefectsCount = 0;

    defectLogs.forEach((log) => {
      (log.defects || []).forEach((d) => {
        const name = d.defectName || "Unspecified";
        const cat = d.category || "Other";

        defectCounts[name] = (defectCounts[name] || 0) + 1;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        totalDefectsCount++;
      });
    });

    // Format array for Chart.js / frontend
    const defectPieData = Object.entries(defectCounts)
      .map(([name, count]) => {
        const percentage = totalDefectsCount > 0 ? Number(((count / totalDefectsCount) * 100).toFixed(1)) : 0;
        return { name, count, percentage };
      })
      .sort((a, b) => b.count - a.count);

    const categoryPieData = Object.entries(categoryCounts)
      .map(([category, count]) => {
        const percentage = totalDefectsCount > 0 ? Number(((count / totalDefectsCount) * 100).toFixed(1)) : 0;
        return { category, count, percentage };
      })
      .sort((a, b) => b.count - a.count);

    res.json({
      totalDefectsCount,
      defectPieData,
      categoryPieData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Operation breakdown: Most issues found by sewing operations
export const getOperationDefects = async (req, res) => {
  try {
    const filter = buildDateFilter(req.query);
    filter.status = "DEFECT";

    const defectLogs = await InspectionLog.find(filter);

    const operationCounts = {};
    let totalDefectCount = 0;

    defectLogs.forEach((log) => {
      (log.defects || []).forEach((d) => {
        const op = d.operation || "General / Not Specified";
        operationCounts[op] = (operationCounts[op] || 0) + 1;
        totalDefectCount++;
      });
    });

    const operations = Object.entries(operationCounts)
      .map(([operation, count]) => {
        const percentage = totalDefectCount > 0 ? Number(((count / totalDefectCount) * 100).toFixed(1)) : 0;
        return { operation, count, percentage };
      })
      .sort((a, b) => b.count - a.count);

    res.json({
      totalDefectCount,
      operations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Heatmap points for displaying defect clusters on garment tech pack
export const getHeatmapPoints = async (req, res) => {
  try {
    const filter = buildDateFilter(req.query);
    filter.status = "DEFECT";

    const defectLogs = await InspectionLog.find(filter);

    const frontPoints = [];
    const backPoints = [];

    defectLogs.forEach((log) => {
      (log.defects || []).forEach((d) => {
        const point = {
          x: d.x,
          y: d.y,
          defectName: d.defectName,
          category: d.category,
          operation: d.operation,
          styleNumber: log.styleNumber,
          timestamp: log.timestamp,
        };

        if (d.viewName === "Back") {
          backPoints.push(point);
        } else {
          frontPoints.push(point);
        }
      });
    });

    res.json({
      totalPoints: frontPoints.length + backPoints.length,
      frontPoints,
      backPoints,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hourly inspection trend for today
export const getHourlyTrend = async (req, res) => {
  try {
    const filter = buildDateFilter(req.query);

    const logs = await InspectionLog.find(filter);

    // Initialize 24 hours (or standard working hours 08:00 - 20:00)
    const hoursMap = {};
    for (let h = 8; h <= 20; h++) {
      const label = `${String(h).padStart(2, "0")}:00`;
      hoursMap[label] = { hour: label, good: 0, rework: 0, total: 0 };
    }

    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      const h = date.getHours();
      if (h >= 8 && h <= 20) {
        const label = `${String(h).padStart(2, "0")}:00`;
        if (hoursMap[label]) {
          if (log.status === "OK") hoursMap[label].good++;
          else hoursMap[label].rework++;
          hoursMap[label].total++;
        }
      }
    });

    const hourlyData = Object.values(hoursMap);
    res.json(hourlyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

