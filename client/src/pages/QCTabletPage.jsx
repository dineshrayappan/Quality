import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { api } from "../services/api";
import { GarmentPinpointCanvas } from "../components/GarmentPinpointCanvas";
import { DefectMultiSelect } from "../components/DefectMultiSelect";
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  TrendingUp,
  Percent,
  Shirt,
  Layers,
  Sparkles,
  Volume2,
  Plus,
  User,
  Edit2,
  X,
} from "lucide-react";

export const QCTabletPage = () => {
  const { t, getLocalizedName, language } = useTranslation();

  // Selections
  const [lines, setLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [techPacks, setTechPacks] = useState([]);
  const [selectedTechPack, setSelectedTechPack] = useState(null);
  const [inspectorName, setInspectorName] = useState(() => {
    return localStorage.getItem("garment_qc_inspector") || "Inspector 01";
  });
  const [isEditingInspector, setIsEditingInspector] = useState(false);
  const [inspectorInput, setInspectorInput] = useState(inspectorName);
  const [currentView, setCurrentView] = useState("Front");
  const [selectedShift, setSelectedShift] = useState("Shift A");

  // Defect logging state
  const [defectsList, setDefectsList] = useState([]);
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false);
  const [pins, setPins] = useState([]);
  const [selectedDefects, setSelectedDefects] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState("General / Not Specified");
  const [notes, setNotes] = useState("");

  // Quick Add Line Modal state
  const [showAddLineModal, setShowAddLineModal] = useState(false);
  const [newLineName, setNewLineName] = useState("");
  const [newSupervisor, setNewSupervisor] = useState("");

  // Daily statistics
  const [summary, setSummary] = useState({
    totalInspected: 0,
    goodPieces: 0,
    reworkPieces: 0,
    passRate: 100,
    reworkRate: 0,
  });

  // Recent logs
  const [recentLogs, setRecentLogs] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popButton, setPopButton] = useState(false);

  // Show temporary toast notification
  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Play subtle feedback beep
  const playBeep = (freq = 800, duration = 100) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      setTimeout(() => {
        osc.stop();
        audioCtx.close();
      }, duration);
    } catch (e) {
      // AudioContext ignore
    }
  };

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      const [linesData, techpacksData, defectsData] = await Promise.all([
        api.getLines(),
        api.getTechPacks(),
        api.getDefects(),
      ]);

      const availableLines = linesData || [];
      setLines(availableLines);
      if (availableLines.length > 0) {
        setSelectedLine((prev) => (prev && availableLines.some((l) => l.name === prev) ? prev : availableLines[0].name));
      } else {
        setSelectedLine("");
      }

      const availableTechPacks = techpacksData || [];
      setTechPacks(availableTechPacks);
      if (availableTechPacks.length > 0) {
        setSelectedTechPack((prev) => (prev && availableTechPacks.some((tp) => tp.styleNumber === prev.styleNumber) ? prev : availableTechPacks[0]));
      } else {
        setSelectedTechPack(null);
      }

      setDefectsList(defectsData || []);
    } catch (err) {
      console.error("Error loading initial QC data:", err);
    }
  }, []);

  // Fetch summary & recent logs
  const refreshStats = useCallback(async () => {
    if (!selectedLine) return;
    try {
      const [sumData, logsData] = await Promise.all([
        api.getSummary({ lineName: selectedLine }),
        api.getRecentLogs(selectedLine, selectedTechPack?.styleNumber),
      ]);
      setSummary(sumData || { totalInspected: 0, goodPieces: 0, reworkPieces: 0, passRate: 100, reworkRate: 0 });
      setRecentLogs(logsData || []);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, [selectedLine, selectedTechPack]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Handle Save Inspector
  const handleSaveInspector = () => {
    const trimmed = inspectorInput.trim() || "Inspector";
    setInspectorName(trimmed);
    localStorage.setItem("garment_qc_inspector", trimmed);
    setIsEditingInspector(false);
  };

  // Create new Line
  const handleCreateLine = async (e) => {
    e.preventDefault();
    if (!newLineName.trim()) return;
    try {
      await api.createLine({ name: newLineName.trim(), supervisor: newSupervisor.trim() });
      setNewLineName("");
      setNewSupervisor("");
      setShowAddLineModal(false);
      await loadInitialData();
    } catch (err) {
      alert("Failed to add line: " + err.message);
    }
  };

  // Handle PASS / OK click
  const handlePassClick = async () => {
    if (isSubmitting) return;
    if (!selectedLine) {
      alert("Please select or add a production line first.");
      return;
    }
    if (!selectedTechPack) {
      alert("Please select or add a Tech Pack first.");
      return;
    }

    try {
      setIsSubmitting(true);
      setPopButton(true);
      playBeep(950, 120);

      await api.logPass({
        lineName: selectedLine,
        styleNumber: selectedTechPack.styleNumber,
        buyer: selectedTechPack.buyer,
        inspectorName,
        shift: selectedShift,
      });

      showToast(t("piecePassSuccess") ? t("piecePassSuccess", { id: summary.totalInspected + 1 }) : `Piece #${summary.totalInspected + 1} Marked OK`, "success");
      await refreshStats();
    } catch (err) {
      console.error("Error logging pass piece:", err);
      showToast("Failed to log OK piece", "error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setPopButton(false), 200);
    }
  };

  // Open Defect Modal
  const handleDefectButtonClick = () => {
    if (!selectedLine) {
      alert("Please select or add a production line first.");
      return;
    }
    if (!selectedTechPack) {
      alert("Please select or add a Tech Pack first.");
      return;
    }
    setIsDefectModalOpen(true);
    setPins([]);
    setSelectedDefects([]);
    setNotes("");
  };

  // Add a pinpoint on canvas
  const handleAddPin = (pinData) => {
    setPins((prev) => [...prev, pinData]);
    playBeep(450, 80);
  };

  // Remove a pinpoint
  const handleRemovePin = (pinToRemove) => {
    setPins((prev) => prev.filter((p) => p !== pinToRemove));
  };

  // Clear all pins
  const handleClearPins = () => {
    setPins([]);
  };

  // Toggle selected defect from multi-select
  const handleToggleDefect = (defect) => {
    setSelectedDefects((prev) => {
      const exists = prev.some((d) => d._id === defect._id || d.code === defect.code);
      if (exists) {
        return prev.filter((d) => d._id !== defect._id && d.code !== defect.code);
      } else {
        return [...prev, defect];
      }
    });
  };

  // Add custom defect manually
  const handleAddNewDefect = async (defectData) => {
    try {
      const res = await api.addCustomDefect({
        ...defectData,
        inspectorName,
      });

      if (res.defect) {
        setDefectsList((prev) => [res.defect, ...prev]);
        setSelectedDefects((prev) => [...prev, res.defect]);
        showToast(t("customDefectCreated") || "Custom defect added", "success");
      }
    } catch (err) {
      console.error("Failed to add custom defect:", err);
      showToast("Error creating custom defect", "error");
    }
  };

  // Confirm Defect Submission (Move to rework)
  const handleSubmitDefects = async () => {
    if (selectedDefects.length === 0) {
      alert("Please select at least one defect type from the list.");
      return;
    }

    try {
      setIsSubmitting(true);
      playBeep(320, 200);

      const formattedDefects = [];

      if (pins.length > 0) {
        pins.forEach((pin, idx) => {
          const defectType = selectedDefects[idx % selectedDefects.length];
          formattedDefects.push({
            defectId: defectType._id,
            defectCode: defectType.code,
            defectName: defectType.name?.en || defectType.code,
            category: defectType.category,
            operation: selectedOperation,
            viewName: pin.viewName || currentView,
            x: pin.x,
            y: pin.y,
            notes,
          });
        });
      } else {
        selectedDefects.forEach((defectType) => {
          formattedDefects.push({
            defectId: defectType._id,
            defectCode: defectType.code,
            defectName: defectType.name?.en || defectType.code,
            category: defectType.category,
            operation: selectedOperation,
            viewName: currentView,
            x: 50,
            y: 50,
            notes,
          });
        });
      }

      await api.logDefect({
        lineName: selectedLine,
        styleNumber: selectedTechPack.styleNumber,
        buyer: selectedTechPack.buyer,
        inspectorName,
        shift: selectedShift,
        defects: formattedDefects,
      });

      showToast(t("pieceDefectSuccess") ? t("pieceDefectSuccess", { count: formattedDefects.length }) : `${formattedDefects.length} defect(s) logged`, "warning");
      setIsDefectModalOpen(false);
      setPins([]);
      setSelectedDefects([]);
      await refreshStats();
    } catch (err) {
      console.error("Failed to log defect:", err);
      showToast("Error sending piece to rework", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Undo last check
  const handleUndoLast = async () => {
    if (recentLogs.length === 0) return;
    const lastLog = recentLogs[0];
    if (!window.confirm("Undo last inspection check?")) return;

    try {
      await api.deleteLog(lastLog._id);
      showToast(t("undoSuccess") || "Inspection undone", "success");
      await refreshStats();
    } catch (err) {
      showToast("Failed to undo check", "error");
    }
  };

  return (
    <div className="flex flex-col space-y-5">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-sm font-bold border transition-all animate-bounce ${
            toastMessage.type === "success"
              ? "bg-emerald-600 border-emerald-400 text-white"
              : "bg-red-600 border-red-400 text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* QC Context Bar: Line Selector, TechPack Selector & Inspector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Line Dropdown or Add Line Button */}
            <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t("selectLine") || "Line"}:</span>
              {lines.length > 0 ? (
                <select
                  value={selectedLine}
                  onChange={(e) => setSelectedLine(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {lines.map((l) => (
                    <option key={l._id || l.name} value={l.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {l.name}
                    </option>
                  ))}
                </select>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddLineModal(true)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAddLineModal(true)}
                className="p-1 rounded text-slate-400 hover:text-blue-500"
                title="Add New Line"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tech Pack / Style Selector */}
            <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Shirt className="w-4 h-4 text-blue-500" />
              {techPacks.length > 0 ? (
                <select
                  value={selectedTechPack?.styleNumber || ""}
                  onChange={(e) => {
                    const tp = techPacks.find((item) => item.styleNumber === e.target.value);
                    setSelectedTechPack(tp);
                  }}
                  className="bg-transparent text-sm font-bold text-blue-600 dark:text-blue-400 focus:outline-none cursor-pointer max-w-[200px] sm:max-w-[280px] truncate"
                >
                  {techPacks.map((tp) => (
                    <option key={tp.styleNumber} value={tp.styleNumber} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {tp.styleNumber} — {tp.buyer} ({tp.itemType})
                    </option>
                  ))}
                </select>
              ) : (
                <Link
                  to="/techpacks"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Tech Pack</span>
                </Link>
              )}
            </div>

            {/* Shift Selector */}
            <div className="hidden sm:flex items-center space-x-1 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              {["Shift A", "Shift B", "General"].map((shift) => (
                <button
                  key={shift}
                  type="button"
                  onClick={() => setSelectedShift(shift)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedShift === shift
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {shift}
                </button>
              ))}
            </div>
          </div>

          {/* Inspector Badge & Undo Action */}
          <div className="flex items-center space-x-3">
            {isEditingInspector ? (
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <input
                  type="text"
                  value={inspectorInput}
                  onChange={(e) => setInspectorInput(e.target.value)}
                  className="px-2 py-1 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 w-32"
                  placeholder="Inspector name"
                />
                <button
                  type="button"
                  onClick={handleSaveInspector}
                  className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                  title="Save Inspector"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingInspector(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setInspectorInput(inspectorName);
                  setIsEditingInspector(true);
                }}
                className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors"
                title="Click to change inspector name"
              >
                <User className="w-4 h-4 text-blue-500" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 font-semibold">{t("inspector") || "Inspector"}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                    <span>{inspectorName}</span>
                    <Edit2 className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>
            )}

            {recentLogs.length > 0 && (
              <button
                type="button"
                onClick={handleUndoLast}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-sm"
                title={t("undoLast") || "Undo last"}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t("undoLast") || "Undo"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Counter Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Inspected */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("inspectedToday") || "Inspected"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {summary.totalInspected}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Good Pieces (OK) */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-4 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {t("goodPieces") || "Good (Passed)"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {summary.goodPieces}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Rework / Defect Pieces */}
        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 rounded-2xl p-4 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              {t("reworkPieces") || "Defects (Rework)"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">
              {summary.reworkPieces}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Pass Rate % */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("passRate") || "Pass Rate"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {summary.passRate}%
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tactile Big Action Touch Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-h-[300px]">
        {/* Big Green PASS / OK Button */}
        <button
          type="button"
          onClick={handlePassClick}
          disabled={isSubmitting}
          className={`group relative flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 active:scale-98 shadow-xl shadow-emerald-600/30 border-4 border-emerald-400/40 transition-all select-none cursor-pointer ${
            popButton ? "scale-95 ring-4 ring-emerald-300" : ""
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
            <Check className="w-12 h-12 text-white stroke-[3.5]" />
          </div>
          <span className="text-3xl sm:text-4xl font-black text-white tracking-wide uppercase drop-shadow-md">
            {t("btnOk") || "PASS / GOOD PIECE"}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-emerald-100 mt-2 text-center max-w-xs opacity-90">
            {t("btnOkSub") || "One-tap pass logging for fast production speed"}
          </span>
          <span className="mt-4 px-4 py-1 rounded-full bg-emerald-900/60 text-emerald-200 text-xs font-bold border border-emerald-400/20">
            +1 Piece Pass Count
          </span>
        </button>

        {/* Big Red DEFECT / REWORK Button */}
        <button
          type="button"
          onClick={handleDefectButtonClick}
          disabled={isSubmitting}
          className="group relative flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-red-600 to-rose-800 hover:from-red-500 hover:to-rose-700 active:scale-98 shadow-xl shadow-red-600/30 border-4 border-red-400/40 transition-all select-none cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
            <AlertTriangle className="w-11 h-11 text-white stroke-[3]" />
          </div>
          <span className="text-3xl sm:text-4xl font-black text-white tracking-wide uppercase drop-shadow-md text-center">
            {t("btnDefect") || "DEFECT / REWORK"}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-red-100 mt-2 text-center max-w-xs opacity-90">
            {t("btnDefectSub") || "Pinpoint defect on garment sketch & send to alteration"}
          </span>
          <span className="mt-4 px-4 py-1 rounded-full bg-red-950/60 text-red-200 text-xs font-bold border border-red-400/20">
            Touch Tech Pack To Pinpoint
          </span>
        </button>
      </div>

      {/* Live Recent Inspections Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t("recentInspections") || "Recent Inspections"}
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Live Server Log</span>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2">
          {recentLogs.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">
              No inspections logged yet for {selectedLine || "this line"}. Tap PASS or DEFECT above.
            </p>
          ) : (
            recentLogs.slice(0, 15).map((log, idx) => (
              <div
                key={log._id || idx}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center space-x-2 ${
                  log.status === "OK"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300"
                    : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    log.status === "OK" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                <span className="font-bold">{log.status}</span>
                <span className="text-slate-400 text-[10px]">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
                {log.defects && log.defects.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-800/60 text-red-800 dark:text-white font-mono">
                    {log.defects[0].defectName}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Line Modal */}
      {showAddLineModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add Factory Production Line</h3>
              <button
                type="button"
                onClick={() => setShowAddLineModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateLine} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Line Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Line 01 - Sewing Endline"
                  value={newLineName}
                  onChange={(e) => setNewLineName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Supervisor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Murugan S"
                  value={newSupervisor}
                  onChange={(e) => setNewSupervisor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLineModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Save Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN DEFECT PINPOINT & MULTI-SELECT MODAL */}
      {isDefectModalOpen && selectedTechPack && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 dark:bg-slate-950/95 backdrop-blur-md flex flex-col p-2 sm:p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-2xl p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white shadow-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {t("defectModalTitle") || "Pinpoint Defect on Garment"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedTechPack.styleNumber} • {selectedTechPack.buyer}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsDefectModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleSubmitDefects}
                disabled={isSubmitting || selectedDefects.length === 0}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-red-600/40 flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>{t("btnSendToRework") || "Send to Rework"}</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 pt-3 overflow-hidden bg-slate-50 dark:bg-slate-950 p-2 rounded-b-2xl">
            {/* Left 7 Columns: Garment Canvas */}
            <div className="lg:col-span-7 h-full overflow-hidden">
              <GarmentPinpointCanvas
                techPack={selectedTechPack}
                currentView={currentView}
                onViewChange={setCurrentView}
                pins={pins}
                onAddPin={handleAddPin}
                onRemovePin={handleRemovePin}
                onClearPins={handleClearPins}
              />
            </div>

            {/* Right 5 Columns: Defect Multi-Select */}
            <div className="lg:col-span-5 h-full overflow-hidden">
              <DefectMultiSelect
                defectsList={defectsList}
                selectedDefects={selectedDefects}
                onToggleDefect={handleToggleDefect}
                onAddNewDefect={handleAddNewDefect}
                operationsList={selectedTechPack.operations || []}
                selectedOperation={selectedOperation}
                onSelectOperation={setSelectedOperation}
                notes={notes}
                onChangeNotes={setNotes}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
