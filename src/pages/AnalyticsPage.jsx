import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "../i18n/LanguageContext";
import { api } from "../services/api";
import { DefectPieChart } from "../components/DefectPieChart";
import { GarmentHeatmapOverlay } from "../components/GarmentHeatmapOverlay";
import {
  Calendar,
  Filter,
  Download,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Percent,
  Scissors,
  FileSpreadsheet,
  Flame,
  XCircle,
  Ban,
  ArrowRight,
} from "lucide-react";

export const AnalyticsPage = () => {
  const { t, getLocalizedName } = useTranslation();

  // Helper for formatting date to YYYY-MM-DD
  const formatYYYYMMDD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatYYYYMMDD(new Date());

  // Date Range Filters: fromDate and toDate
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(todayStr);
  const [datePreset, setDatePreset] = useState("today"); // 'today', 'yesterday', 'week', 'month', 'custom'

  // Other Filters
  const [selectedLine, setSelectedLine] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All"); // 'All', 'OK', 'DEFECT', 'REJECT'

  const [lines, setLines] = useState([]);
  const [techPacks, setTechPacks] = useState([]);

  // Data states
  const [summary, setSummary] = useState({
    totalInspected: 0,
    goodPieces: 0,
    reworkPieces: 0,
    rejectedPieces: 0,
    passRate: 100,
    reworkRate: 0,
    rejectionRate: 0,
    totalDefectSpots: 0,
  });

  const [defectPieData, setDefectPieData] = useState([]);
  const [totalDefectsCount, setTotalDefectsCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ DEFECT: 0, REJECT: 0 });
  const [operationsData, setOperationsData] = useState([]);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [heatmapView, setHeatmapView] = useState("Front");
  const [activeTab, setActiveTab] = useState("charts"); // 'charts' | 'heatmap' | 'logs'
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load dropdown options (lines, techpacks)
  useEffect(() => {
    const initFilters = async () => {
      const [linesData, tpData] = await Promise.all([
        api.getLines(),
        api.getTechPacks(),
      ]);
      setLines(linesData || []);
      setTechPacks(tpData || []);
    };
    initFilters();
  }, []);

  // Set date preset shortcuts
  const applyDatePreset = (preset) => {
    setDatePreset(preset);
    const now = new Date();

    if (preset === "today") {
      const today = formatYYYYMMDD(now);
      setFromDate(today);
      setToDate(today);
    } else if (preset === "yesterday") {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yStr = formatYYYYMMDD(y);
      setFromDate(yStr);
      setToDate(yStr);
    } else if (preset === "week") {
      const past7 = new Date();
      past7.setDate(past7.getDate() - 6);
      setFromDate(formatYYYYMMDD(past7));
      setToDate(formatYYYYMMDD(now));
    } else if (preset === "month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setFromDate(formatYYYYMMDD(firstDay));
      setToDate(formatYYYYMMDD(now));
    }
  };

  // Build filter parameters for backend
  const getFilterParams = useCallback(() => {
    const params = {};
    if (selectedLine !== "All") params.lineName = selectedLine;
    if (selectedStyle !== "All") params.styleNumber = selectedStyle;
    if (selectedStatus !== "All") params.status = selectedStatus;

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    return params;
  }, [fromDate, toDate, selectedLine, selectedStyle, selectedStatus]);

  // Fetch report data
  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const params = getFilterParams();

      const [sum, pie, ops, heat, recent] = await Promise.all([
        api.getSummary(params),
        api.getDefectPieChart(params),
        api.getOperationDefects(params),
        api.getHeatmapPoints(params),
        api.getRecentLogs(params),
      ]);

      setSummary(sum || {});
      setDefectPieData(pie?.defectPieData || []);
      setTotalDefectsCount(pie?.totalDefectsCount || 0);
      setStatusCounts(pie?.statusCounts || { DEFECT: 0, REJECT: 0 });
      setOperationsData(ops?.operations || []);

      const allPoints = [
        ...(heat?.frontPoints || []).map((p) => ({ ...p, viewName: "Front" })),
        ...(heat?.backPoints || []).map((p) => ({ ...p, viewName: "Back" })),
      ];
      setHeatmapPoints(allPoints);
      setLogs(recent || []);
    } catch (err) {
      console.error("Error fetching analytics report:", err);
    } finally {
      setLoading(false);
    }
  }, [getFilterParams]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Export inspection logs to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert("No data available to export for selected range");
      return;
    }

    const headers = [
      "Timestamp",
      "Line",
      "Style",
      "Buyer",
      "Inspector",
      "Status (Passed/Rework/Rejected)",
      "Defects Count",
      "Defect Details",
    ];

    const rows = logs.map((log) => {
      const defectSummary = (log.defects || [])
        .map((d) => `${d.defectName} [${d.operation || "N/A"}]`)
        .join("; ");

      const statusLabel =
        log.status === "OK"
          ? "PASSED"
          : log.status === "REJECT"
            ? "REJECTED (SCRAP)"
            : "REWORK (ALTERATION)";

      return [
        `"${new Date(log.timestamp).toLocaleString()}"`,
        `"${log.lineName}"`,
        `"${log.styleNumber}"`,
        `"${log.buyer || ""}"`,
        `"${log.inspectorName}"`,
        `"${statusLabel}"`,
        log.defects ? log.defects.length : 0,
        `"${defectSummary}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `endline_qc_report_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedTechPackObj = techPacks.find((tp) => tp.styleNumber === selectedStyle) || techPacks[0];

  return (
    <div className="space-y-6">

      {/* Top Header & Export Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-3">
            <PieChart className="w-7 h-7 text-blue-600 dark:text-blue-500" />
            <span>Daily & Periodic QC Analytics</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Tab Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("charts")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "charts"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              Charts & Ops
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("heatmap")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${activeTab === "heatmap"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Garment Heatmap</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("logs")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "logs"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              Log Records ({logs.length})
            </button>
          </div>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* FILTER PANEL: From Date, To Date, Presets, Line, Style, and Rejection/Status */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 transition-colors">

        {/* Row 1: From Date & To Date Range + Quick Presets */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">

          {/* Explicit From Date & To Date Inputs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">From Date:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setDatePreset("custom");
                }}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              />
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />

            <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">To Date:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setDatePreset("custom");
                }}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => applyDatePreset("today")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${datePreset === "today"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => applyDatePreset("yesterday")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${datePreset === "yesterday"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
              Yesterday
            </button>
            <button
              type="button"
              onClick={() => applyDatePreset("week")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${datePreset === "week"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => applyDatePreset("month")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${datePreset === "month"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Row 2: Line, Style & Rejection / Status Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex flex-wrap items-center gap-3">
            {/* Production Line Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Line:</span>
              <select
                value={selectedLine}
                onChange={(e) => setSelectedLine(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All">All Factory Lines</option>
                {lines.map((l) => (
                  <option key={l._id || l.name} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buyer Style Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Style:</span>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                <option value="All">All Garment Styles</option>
                {techPacks.map((tp) => (
                  <option key={tp.styleNumber} value={tp.styleNumber}>
                    {tp.styleNumber} ({tp.buyer})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rejection & Status Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 hidden sm:inline">
              Status:
            </span>
            <button
              type="button"
              onClick={() => setSelectedStatus("All")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${selectedStatus === "All"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("OK")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${selectedStatus === "OK"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Passed</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("DEFECT")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${selectedStatus === "DEFECT"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Rework</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("REJECT")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${selectedStatus === "REJECT"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                }`}
            >
              <Ban className="w-3 h-3" />
              <span>Rejection (Scrap)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS (Total, Passed, Rework, Rejection, Defect Spots) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Inspected */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Inspected
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {summary.totalInspected || 0}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {fromDate === toDate ? fromDate : `${fromDate} to ${toDate}`}
          </p>
        </div>

        {/* Good Pieces (Passed) */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <span>Passed (OK)</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {summary.goodPieces || 0}
          </h3>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-semibold">
            {summary.passRate || 0}% Pass Rate
          </p>
        </div>

        {/* Rework Pieces (Alteration) */}
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <span>Rework (Alter)</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {summary.reworkPieces || 0}
          </h3>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1 font-semibold">
            {summary.reworkRate || 0}% Rework Rate
          </p>
        </div>

        {/* REJECTION PIECES (Permanent Scrap) */}
        <div className="bg-white dark:bg-slate-900 border border-red-300 dark:border-red-900/50 rounded-2xl p-4 shadow-sm transition-colors bg-red-50/20 dark:bg-red-950/10">
          <div className="flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            <span>Rejection (Scrap)</span>
            <Ban className="w-4 h-4 text-red-500" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 mt-1">
            {summary.rejectedPieces || 0}
          </h3>
          <p className="text-[11px] text-red-600/90 dark:text-red-400/90 mt-1 font-semibold">
            {summary.rejectionRate || 0}% Rejection Rate
          </p>
        </div>

        {/* Total Defect Pinpoints */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors col-span-2 lg:col-span-1">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Defect Instances
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {totalDefectsCount || 0}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Tagged on garment sketches
          </p>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "charts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Defect Percentage Pie Chart */}
          <div className="lg:col-span-7 flex flex-col">
            <DefectPieChart
              data={defectPieData}
              totalDefects={totalDefectsCount}
              title={`Defect Pareto Distribution (${fromDate} to ${toDate})`}
              subtitle={`Includes ${statusCounts.DEFECT} rework defects & ${statusCounts.REJECT} rejection scrap causes`}
            />
          </div>

          {/* Operations Breakdown List */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col transition-colors">
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Scissors className="w-5 h-5 text-amber-500" />
                  <span>Defects by Sewing Operation</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Operations creating rework and scrap
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {operationsData.length} Ops
              </span>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-3 max-h-96 pr-1">
              {operationsData.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">
                  No operations recorded with defects for this period.
                </p>
              ) : (
                operationsData.map((op, idx) => (
                  <div
                    key={op.operation || idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {op.operation}
                      </span>
                      <span className="font-extrabold text-red-600 dark:text-red-400">
                        {op.count} pcs ({op.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-red-600"
                        style={{ width: `${Math.min(100, op.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Tab */}
      {activeTab === "heatmap" && (
        <div className="min-h-[600px]">
          <GarmentHeatmapOverlay
            techPack={selectedTechPackObj}
            points={heatmapPoints}
            activeView={heatmapView}
            onViewChange={setHeatmapView}
          />
        </div>
      )}

      {/* Log Records Tab with Status Filter & Clear Rejection Badges */}
      {activeTab === "logs" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Detailed Inspection Log Records ({logs.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Range: {fromDate} to {toDate} • Showing {selectedStatus === "All" ? "all pieces" : selectedStatus}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Line</th>
                  <th className="px-4 py-3">Style / Buyer</th>
                  <th className="px-4 py-3">Inspector</th>
                  <th className="px-4 py-3">QC Result</th>
                  <th className="px-4 py-3">Defects / Rejection Reasons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No inspection logs found between {fromDate} and {toDate} with current filter.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isPassed = log.status === "OK";
                    const isRejected = log.status === "REJECT";
                    const isRework = log.status === "DEFECT";

                    return (
                      <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                          {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                          {log.lineName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-blue-600 dark:text-blue-400">{log.styleNumber}</span>
                          {log.buyer && <span className="text-slate-400 ml-1">({log.buyer})</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {log.inspectorName}
                        </td>
                        <td className="px-4 py-3">
                          {isPassed && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>PASSED</span>
                            </span>
                          )}
                          {isRework && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                              <AlertTriangle className="w-3 h-3" />
                              <span>REWORK</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
                              <Ban className="w-3 h-3" />
                              <span>REJECTED (SCRAP)</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {log.defects && log.defects.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {log.defects.map((d, i) => (
                                <span
                                  key={i}
                                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${isRejected
                                      ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                    }`}
                                >
                                  {d.defectName} ({d.operation || "General"})
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
