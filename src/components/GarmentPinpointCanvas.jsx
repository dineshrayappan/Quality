import React, { useRef } from "react";
import { useTranslation } from "../i18n/LanguageContext";
import { MapPin, X, RotateCcw, Eye, ImageOff } from "lucide-react";

export const GarmentPinpointCanvas = ({
  techPack,
  currentView,
  onViewChange,
  pins,
  onAddPin,
  onRemovePin,
  onClearPins,
  activeDefectType = "",
}) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  // Get current view image URL from the tech pack
  const viewObj = techPack?.views?.find((v) => v.viewName === currentView) || techPack?.views?.[0];
  const imageUrl = viewObj?.imageUrl || techPack?.imageUrl || "";

  const handlePointerDown = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Support touch and mouse pointer
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

    if (clientX === undefined || clientY === undefined) return;

    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

    // Round to 1 decimal place
    onAddPin({
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      viewName: currentView,
      timestamp: Date.now(),
    });
  };

  // Filter pins belonging to the current view
  const currentViewPins = pins.filter((p) => p.viewName === currentView);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-colors">

      {/* Canvas Top Bar: View Switcher (Front/Back) & Pin Count */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
        {/* Front / Back Toggle Buttons */}
        <div className="flex items-center space-x-2">
          {["Front", "Back"].map((vName) => (
            <button
              key={vName}
              type="button"
              onClick={() => onViewChange(vName)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${currentView === vName
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{vName === "Front" ? (t("viewFront") || "Front") : (t("viewBack") || "Back")}</span>
              {pins.filter((p) => p.viewName === vName).length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pins.filter((p) => p.viewName === vName).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Pin Stats & Clear Action */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>
              {t("pinsPlaced") || "Pins"}: <strong className="text-slate-900 dark:text-white text-sm">{pins.length}</strong>
            </span>
          </div>

          {pins.length > 0 && (
            <button
              type="button"
              onClick={onClearPins}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-300 text-xs font-semibold border border-red-200 dark:border-red-900/40 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t("clearPins") || "Clear"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Instruction Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/30 px-4 py-2 flex items-center justify-between text-xs">
        <span className="text-blue-700 dark:text-blue-200 flex items-center space-x-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>{t("touchInstruction") || "Tap on garment sketch to place defect pinpoint marker"}</span>
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">
          {techPack ? `${techPack.styleNumber} (${techPack.buyer})` : "No Style Selected"}
        </span>
      </div>

      {/* Interactive Garment Canvas Area */}
      <div className="relative flex-1 flex items-center justify-center p-4 bg-slate-100/50 dark:bg-slate-950/50 select-none overflow-hidden">
        <div
          ref={containerRef}
          onClick={handlePointerDown}
          className="relative max-w-[480px] w-full aspect-[6/7] rounded-xl border border-slate-300 dark:border-slate-800/80 bg-white shadow-2xl cursor-crosshair overflow-hidden touch-none flex items-center justify-center"
        >
          {/* Tech Pack Flat Sketch Image (Selected Style's Image) */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={techPack?.styleNumber ? `${techPack.styleNumber} ${currentView}` : "Garment Inspection"}
              className="w-full h-full object-contain pointer-events-none select-none p-2"
              draggable={false}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 pointer-events-none">
              <ImageOff className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                No sketch image added for this Tech Pack
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Upload image in Buyer Tech Packs to inspect on garment sketch
              </p>
            </div>
          )}

          {/* Placed Defect Pinpoint Markers */}
          {currentViewPins.map((pin, index) => {
            const overallIndex = pins.indexOf(pin) + 1;
            return (
              <div
                key={pin.timestamp || index}
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation(); // prevent adding new pin on top of existing
                  onRemovePin(pin);
                }}
                className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                title={`${t("removePin") || "Remove Pin"} #${overallIndex} (${pin.x}%, ${pin.y}%)`}
              >
                {/* Glowing Radar Pulse */}
                <span className="absolute -inset-2 rounded-full bg-red-500/30 pin-pulse pointer-events-none" />

                {/* Pin Head Badge */}
                <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white font-extrabold text-xs shadow-lg shadow-red-600/50 border-2 border-white group-hover:bg-red-700 group-hover:scale-110 transition-transform">
                  {overallIndex}

                  {/* Delete Overlay Icon on Hover */}
                  <span className="hidden group-hover:flex absolute inset-0 rounded-full bg-red-900 text-white items-center justify-center">
                    <X className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Defect Label Tag tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center z-30">
                  <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-slate-700 whitespace-nowrap">
                    Pin #{overallIndex}: {pin.x}% / {pin.y}%
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-700"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Canvas Bottom Legend */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Click pin to delete • Supports multi-touch pinpointing</span>
        <span className="text-slate-400 dark:text-slate-500">View: {currentView}</span>
      </div>
    </div>
  );
};
