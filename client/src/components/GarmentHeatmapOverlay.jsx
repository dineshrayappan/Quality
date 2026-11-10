import React, { useState } from "react";
import { useTranslation } from "../i18n/LanguageContext";
import { Eye, Flame, MapPin, ImageOff } from "lucide-react";

export const GarmentHeatmapOverlay = ({
  techPack,
  points = [],
  activeView = "Front",
  onViewChange,
  showLabels = true,
}) => {
  const { t } = useTranslation();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Use the exact image from the tech pack views or top-level imageUrl
  const viewObj = techPack?.views?.find((v) => v.viewName === activeView) || techPack?.views?.[0];
  const imageUrl = viewObj?.imageUrl || techPack?.imageUrl || "";

  // Filter points matching active view
  const currentPoints = points.filter((p) => (p.viewName || "Front") === activeView);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-colors">
      
      {/* Heatmap Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            {t("tvGarmentHeatmap") || "Defect Heatmap"}
          </h3>
        </div>

        {/* View Switcher (Front / Back) */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => onViewChange && onViewChange("Front")}
            className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
              activeView === "Front"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t("viewFront") || "Front"}
          </button>
          <button
            type="button"
            onClick={() => onViewChange && onViewChange("Back")}
            className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
              activeView === "Back"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t("viewBack") || "Back"}
          </button>
        </div>
      </div>

      {/* Heatmap Canvas Container */}
      <div className="relative flex-1 flex items-center justify-center p-4 bg-slate-100/60 dark:bg-slate-950/70 select-none overflow-hidden">
        <div className="relative max-w-[460px] w-full aspect-[6/7] rounded-xl border border-slate-300 dark:border-slate-800 bg-white shadow-2xl overflow-hidden flex items-center justify-center">
          
          {/* Base Tech Pack Garment Sketch (THAT specific tech pack image) */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={techPack?.styleNumber ? `${techPack.styleNumber} ${activeView}` : "Garment Heatmap"}
              className="w-full h-full object-contain pointer-events-none select-none opacity-90 p-2"
              draggable={false}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
              <ImageOff className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                No sketch image added for this Tech Pack
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Please upload an image in Buyer Tech Packs
              </p>
            </div>
          )}

          {/* SVG Heat Gradient Layer for Glowing Hotspots */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#f97316" stopOpacity="0.6" />
                <stop offset="70%" stopColor="#eab308" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Glowing heat halos */}
            {currentPoints.map((pt, idx) => (
              <circle
                key={`glow-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r="6.5"
                fill="url(#heatGlow)"
                className="animate-pulse"
                style={{ animationDuration: `${2 + (idx % 3)}s` }}
              />
            ))}
          </svg>

          {/* Interactive Defect Pinpoints & Hover Info */}
          {currentPoints.map((pt, idx) => (
            <div
              key={`pt-${idx}`}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Inner intense heat core */}
              <div className="w-4 h-4 rounded-full bg-red-600 border border-white shadow-md flex items-center justify-center text-[9px] font-bold text-white group-hover:scale-150 transition-transform">
                •
              </div>

              {/* Tooltip on hover */}
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center z-30">
                <div className="bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-red-400">{pt.defectName}</span>
                    {pt.status && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        pt.status === "REJECT" ? "bg-red-600 text-white" : "bg-amber-600 text-white"
                      }`}>
                        {pt.status === "REJECT" ? "Scrap" : "Rework"}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-300">Op: {pt.operation}</div>
                </div>
                <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-700"></div>
              </div>
            </div>
          ))}

          {/* Heat Intensity Scale Legend */}
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 backdrop-blur-sm text-[10px] flex items-center space-x-1.5 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400">Low</span>
            <div className="w-16 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 via-orange-500 to-red-600" />
            <span className="text-red-500 dark:text-red-400 font-bold">High</span>
          </div>
        </div>
      </div>

      {/* Heatmap Footer Info */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
        <span>
          Detected Hotspots: <strong className="text-slate-900 dark:text-white font-bold">{currentPoints.length}</strong>
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
          {techPack ? `${techPack.styleNumber} (${techPack.buyer})` : "Select a Tech Pack"}
        </span>
      </div>
    </div>
  );
};
