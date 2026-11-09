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
} from "lucide-react";

export const AnalyticsPage = () => {
  const { t, getLocalizedName } = useTranslation();

  // Filters
  const [dateOption, setDateOption] = useState("today"); // 'today', 'yesterday', 'custom'
  const [customDate, setCustomDate] = useState("");
  const [selectedLine, setSelectedLine] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");

  const [lines, setLines] = useState([]);
  const [techPacks, setTechPacks] = useState([]);

  // Data states
  const [summary, setSummary] = useState({
    totalInspected: 0,
    goodPieces: 0,
    reworkPieces: 0,
    passRate: 100,
    reworkRate: 0,
  });

  const [defectPieData, setDefectPieData] = useState([]);
  const [totalDefectsCount, setTotalDefectsCount] = useState(0);
  const [operationsData, setOperationsData] = useState([]);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [heatmapView, setHeatmapView] = useState("Front");
  const [activeTab, setActiveTab] = useState("charts"); // 'charts' | 'heatmap' | 'logs'
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load dropdown options
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

  // Compute effective date query
  const getFilterParams = useCallback(() => {
    const params = {};
    if (selectedLine !== "All") params.lineName = selectedLine;
    if (selectedStyle !== "All") params.styleNumber = selectedStyle;

    if (dateOption === "today") {
      const today = new Date().toISOString().split("T")[0];
      params.date = today;
    } else if (dateOption === "yesterday") {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      params.date = y.toISOString().split("T")[0];
    } else if (dateOption === "custom" && customDate) {
      params.date = customDate;
    }

    return params;
  }, [dateOption, customDate, selectedLine, selectedStyle]);

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
        api.getRecentLogs(params.lineName, params.styleNumber),
      ]);

      setSummary(sum || {});
      setDefectPieData(pie?.defectPieData || []);
      setTotalDefectsCount(pie?.totalDefectsCount || 0);
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
      alert("No data available to export");
      return;
    }

    const headers = [
      "Timestamp",
      "Line",
      "Style",
      "Buyer",
      "Inspector",
      "Status",
      "Defects Count",
      "Defect Details",
    ];

    const rows = logs.map((log) => {
      const defectSummary = (log.defects || [])
        .map((d) => `${d.defectName} [${d.operation || "N/A"}]`)
        .join("; ");

      return [
        `"${new Date(log.timestamp).toLocaleString()}"`,
        `"${log.lineName}"`,
        `"${log.styleNumber}"`,
        `"${log.buyer || ""}"`,
        `"${log.inspectorName}"`,
        `"${log.status}"`,
        log.defects ? log.defects.length : 0,
        `"${defectSummary}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `endline_qc_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedTechPackObj = techPacks.find((tp) => tp.styleNumber === selectedStyle) || techPacks[0];

  return (
    <div className="space-y-6">
      
      {/* Header & Export Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-3">
            <PieChart className="w-7 h-7 text-blue-600 dark:text-blue-500" />
            <span>{t("navAnalytics") || "QC Analytics & Heatmap"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time quality metrics, defect Pareto distribution, and garment heat clusters
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Tab Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("charts")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "charts"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Charts & Ops
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("heatmap")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === "heatmap"
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "logs"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Log Records
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t("exportCsv") || "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        
        {/* Date Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <button
            type="button"
            onClick={() => setDateOption("today")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              dateOption === "today"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {t("today") || "Today"}
          </button>
          <button
            type="button"
            onClick={() => setDateOption("yesterday")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              dateOption === "yesterday"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {t("yesterday") || "Yesterday"}
          </button>
          <input
            type="date"
            value={customDate}
            onChange={(e) => {
              setCustomDate(e.target.value);
              setDateOption("custom");
            }}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Line & Style Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">{t("filterLine") || "Line"}:</span>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">{t("allLines") || "All Lines"}</option>
              {lines.map((l) => (
                <option key={l._id || l.name} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">{t("filterStyle") || "Style"}:</span>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              <option value="All">{t("allStyles") || "All Styles"}</option>
              {techPacks.map((tp) => (
                <option key={tp.styleNumber} value={tp.styleNumber}>
                  {tp.styleNumber} ({tp.buyer})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t("inspectedToday") || "Total Inspected"}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {summary.totalInspected || 0}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Checked on sewing end-line</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-4 shadow-sm transition-colors">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            {t("goodPieces") || "Good Pieces"}
          </p>
          <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {summary.goodPieces || 0}
          </h3>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">
            {summary.passRate || 0}% pass rate
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 rounded-2xl p-4 shadow-sm transition-colors">
          <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            {t("reworkPieces") || "Rework Pieces"}
          </p>
          <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">
            {summary.reworkPieces || 0}
          </h3>
          <p className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-1">
            {summary.reworkRate || 0}% defect rate
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 shadow-sm transition-colors">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Defect Pinpoints
          </p>
          <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {totalDefectsCount || 0}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Identified on garment sketches</p>
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
              title={t("pieChartTitle") || "Defect Type Pareto Distribution"}
              subtitle={t("pieChartSub") || "Most frequent defect categories found on production line"}
            />
          </div>

          {/* Operations Breakdown List */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col transition-colors">
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-amber-500" />
                <span>{t("operationsChartTitle") || "Defects by Sewing Operation"}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Defects grouped by root sewing operation
              </p>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-3 max-h-96 pr-1">
              {operationsData.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">
                  No operations recorded with defects for this period.
                </p>
              ) : (
                operationsData.map((op, idx) => (
                  <div
                    key={op.operation}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {op.operation}
                      </span>
                      <span className="font-extrabold text-red-600 dark:text-red-400">
                        {op.count} pcs ({op.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-600"
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
        <div className="h-[600px]">
          <GarmentHeatmapOverlay
            techPack={selectedTechPackObj}
            points={heatmapPoints}
            activeView={heatmapView}
            onViewChange={setHeatmapView}
          />
        </div>
      )}

      {/* Log Records Tab */}
      {activeTab === "logs" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Inspection Records Log ({logs.length})
            </h3>
            <span className="text-xs text-slate-400">Sorted by newest</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Line</th>
                  <th className="px-4 py-3">Style / Buyer</th>
                  <th className="px-4 py-3">Inspector</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">Defects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No inspection logs found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
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
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === "OK"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                              : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800"
                          }`}
                        >
                          {log.status === "OK" ? "PASSED" : "REWORK"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {log.defects && log.defects.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {log.defects.map((d, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
