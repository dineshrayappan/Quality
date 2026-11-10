import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { api } from "../services/api";
import { GarmentHeatmapOverlay } from "../components/GarmentHeatmapOverlay";
import { DefectPieChart } from "../components/DefectPieChart";
import {
  Tv,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Scissors,
  Maximize2,
  Minimize2,
  RefreshCw,
  Clock,
  Layers,
  Shirt,
  Plus,
  Ban,
  Wrench,
} from "lucide-react";

export const TVDashboardPage = () => {
  const { t, getLocalizedName } = useTranslation();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedLine, setSelectedLine] = useState("");
  const [lines, setLines] = useState([]);
  const [techPacks, setTechPacks] = useState([]);
  const [selectedTechPack, setSelectedTechPack] = useState(null);
  const [heatmapView, setHeatmapView] = useState("Front");

  // Live Stats
  const [summary, setSummary] = useState({
    totalInspected: 0,
    goodPieces: 0,
    reworkPieces: 0,
    rejectedPieces: 0,
    passRate: 100,
    reworkRate: 0,
    rejectionRate: 0,
  });

  const [pieData, setPieData] = useState([]);
  const [totalDefectsCount, setTotalDefectsCount] = useState(0);
  const [operationsData, setOperationsData] = useState([]);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Toggle Fullscreen mode for TV screen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Fetch all TV dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!selectedLine) return;
    try {
      const [sum, pie, ops, heat, hourly] = await Promise.all([
        api.getSummary({ lineName: selectedLine, styleNumber: selectedTechPack?.styleNumber }),
        api.getDefectPieChart({ lineName: selectedLine, styleNumber: selectedTechPack?.styleNumber }),
        api.getOperationDefects({ lineName: selectedLine, styleNumber: selectedTechPack?.styleNumber }),
        api.getHeatmapPoints({ lineName: selectedLine, styleNumber: selectedTechPack?.styleNumber }),
        api.getHourlyTrend({ lineName: selectedLine }),
      ]);

      setSummary(sum || {});
      setPieData(pie?.defectPieData || []);
      setTotalDefectsCount(pie?.totalDefectsCount || 0);
      setOperationsData(ops?.operations || []);

      const allPoints = [
        ...(heat?.frontPoints || []).map((p) => ({ ...p, viewName: "Front" })),
        ...(heat?.backPoints || []).map((p) => ({ ...p, viewName: "Back" })),
      ];
      setHeatmapPoints(allPoints);
      setHourlyData(hourly || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("TV Dashboard refresh error:", err);
    }
  }, [selectedLine, selectedTechPack]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      const [linesData, tpData] = await Promise.all([
        api.getLines(),
        api.getTechPacks(),
      ]);
      const availableLines = linesData || [];
      setLines(availableLines);
      if (availableLines.length > 0) setSelectedLine(availableLines[0].name);

      const availableTechPacks = tpData || [];
      setTechPacks(availableTechPacks);
      if (availableTechPacks.length > 0) setSelectedTechPack(availableTechPacks[0]);
    };
    init();
  }, []);

  // Poll every 5 seconds for live shop-floor TV display
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  return (
    <div className="flex flex-col space-y-5">
      
      {/* TV Screen Top Banner */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        
        {/* Left: TV Branding & Line Info */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-black tracking-wider uppercase text-slate-900 dark:text-white">
                {t("tvTitle") || "Shop-Floor Live TV Dashboard"}
              </h1>
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-[10px] font-bold animate-pulse uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>LIVE</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{selectedLine || "No line selected"}</span>
              <span>•</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">{selectedTechPack?.styleNumber || "All Styles"}</span>
              <span>•</span>
              <span>{lastRefreshed.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Right: Selectors & Fullscreen */}
        <div className="flex items-center space-x-2.5">
          {/* Production Line Switcher */}
          {lines.length > 0 ? (
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none shadow-sm cursor-pointer"
            >
              {lines.map((l) => (
                <option key={l._id || l.name} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          ) : (
            <Link to="/" className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Line in Tablet</span>
            </Link>
          )}

          {/* Style / Tech Pack Switcher (Changes Heatmap Image!) */}
          {techPacks.length > 0 && (
            <select
              value={selectedTechPack?.styleNumber || ""}
              onChange={(e) => {
                const tp = techPacks.find((item) => item.styleNumber === e.target.value);
                setSelectedTechPack(tp);
              }}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 focus:outline-none shadow-sm cursor-pointer max-w-[200px] truncate"
              title="Select style to view its garment sketch in heatmap"
            >
              {techPacks.map((tp) => (
                <option key={tp.styleNumber} value={tp.styleNumber}>
                  {tp.styleNumber} ({tp.buyer})
                </option>
              ))}
            </select>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white shadow-sm transition-colors"
            title="Toggle TV Fullscreen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Hero Big Metrics Counters (Total, Passed, Rework, Rejection, Defect Spots) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Inspected */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t("tvTotalChecked") || "Total Checked"}</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
            {summary.totalInspected || 0}
          </div>
          <span className="text-[11px] text-slate-400">Total garments</span>
        </div>

        {/* Good Pieces Passed */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span>Passed (OK)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {summary.goodPieces || 0}
          </div>
          <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70 font-semibold">
            {summary.passRate || 0}% First-Time-Right
          </span>
        </div>

        {/* Defects Rework */}
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <span>Rework (Alter)</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {summary.reworkPieces || 0}
          </div>
          <span className="text-[11px] text-amber-600/80 dark:text-amber-400/70 font-semibold">
            {summary.reworkRate || 0}% Rework Rate
          </span>
        </div>

        {/* Rejection / Scrap Pieces */}
        <div className="bg-white dark:bg-slate-900 border border-red-300 dark:border-red-900/50 rounded-2xl p-4 shadow-sm transition-colors bg-red-50/20 dark:bg-red-950/10">
          <div className="flex items-center justify-between text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
            <span>Rejection (Scrap)</span>
            <Ban className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-red-600 dark:text-red-400 mt-1">
            {summary.rejectedPieces || 0}
          </div>
          <span className="text-[11px] text-red-600/90 dark:text-red-400/90 font-semibold">
            {summary.rejectionRate || 0}% Scrap Rate
          </span>
        </div>

        {/* Total Defect Hotspots */}
        <div className="bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-900/40 rounded-2xl p-4 shadow-sm transition-colors col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            <span>Defect Hotspots</span>
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-orange-600 dark:text-orange-400 mt-1">
            {heatmapPoints.length}
          </div>
          <span className="text-[11px] text-orange-600/80 dark:text-orange-400/70 font-medium">
            Tagged defect spots
          </span>
        </div>
      </div>

      {/* Main Grid: Left Heatmap Overlay (THAT style image) & Right Live Defect Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[500px]">
        
        {/* Left 7 Columns: Garment Heatmap (Uses selected tech pack sketch image) */}
        <div className="lg:col-span-7 flex flex-col min-h-[480px]">
          <GarmentHeatmapOverlay
            techPack={selectedTechPack}
            points={heatmapPoints}
            activeView={heatmapView}
            onViewChange={setHeatmapView}
          />
        </div>

        {/* Right 5 Columns: Defect Breakdown & Pareto Chart */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Defect Pareto Distribution Pie Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{t("tvDefectPareto") || "Defect Type Breakdown"}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {totalDefectsCount} defects
              </span>
            </h3>
            <div className="h-[200px]">
              <DefectPieChart data={pieData} />
            </div>
          </div>

          {/* Sewing Operations Issue Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex-1 transition-colors">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Scissors className="w-4 h-4 text-blue-500" />
              <span>{t("tvTopOperations") || "Most Defective Sewing Operations"}</span>
            </h3>

            {operationsData.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No rework defects logged yet for {selectedLine || "this line"}.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {operationsData.slice(0, 6).map((op, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {op.operation}
                      </span>
                      <span className="font-bold text-red-600 dark:text-red-400">
                        {op.count} pcs ({op.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-600"
                        style={{ width: `${Math.min(100, op.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
