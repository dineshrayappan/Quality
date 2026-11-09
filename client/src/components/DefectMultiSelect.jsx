import React, { useState } from "react";
import { useTranslation } from "../i18n/LanguageContext";
import { 
  Plus, 
  Check, 
  Search, 
  AlertCircle, 
  Tag, 
  X, 
  Sparkles,
  Scissors
} from "lucide-react";

export const DefectMultiSelect = ({
  defectsList = [],
  selectedDefects = [],
  onToggleDefect,
  onAddNewDefect,
  operationsList = [],
  selectedOperation,
  onSelectOperation,
  notes,
  onChangeNotes,
}) => {
  const { t, getLocalizedName, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDefectName, setNewDefectName] = useState("");
  const [newDefectCategory, setNewDefectCategory] = useState("Stitching");
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Filter defects by search query (checks localized name and code)
  const filteredDefects = defectsList.filter((d) => {
    const locName = getLocalizedName(d.name, d.code).toLowerCase();
    const enName = (d.name?.en || "").toLowerCase();
    const code = (d.code || "").toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    return locName.includes(query) || enName.includes(query) || code.includes(query);
  });

  const handleCreateNewDefect = async (e) => {
    e.preventDefault();
    if (!newDefectName.trim() || isSubmittingNew) return;

    try {
      setIsSubmittingNew(true);
      await onAddNewDefect({
        name: newDefectName.trim(),
        category: newDefectCategory,
        severity: "Major",
        language,
      });
      setNewDefectName("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add defect:", err);
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const categories = [
    "Stitching",
    "Fabric",
    "Stain / Soil",
    "Trims / Accessories",
    "Measurement",
    "Other",
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-colors">
      
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>{t("selectDefectsLabel") || "Select Defect(s)"}</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {selectedDefects.length} {t("selectedDefects")?.toLowerCase() || "defects selected"}
          </p>
        </div>

        {/* Quick Add Custom Defect Button */}
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-600/25 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t("addCustomDefectBtn") || "+ Add Defect"}</span>
        </button>
      </div>

      {/* Selected Defect Tags / Badges */}
      {selectedDefects.length > 0 && (
        <div className="p-3 bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
          {selectedDefects.map((d) => (
            <span
              key={d._id || d.code}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/40 text-xs font-medium"
            >
              <span>{getLocalizedName(d.name, d.code)}</span>
              {d.isCustom && (
                <span className="text-[9px] uppercase px-1 rounded bg-red-200 dark:bg-red-600/40 text-red-800 dark:text-red-200">
                  {t("customDefectTag") || "Manual"}
                </span>
              )}
              <button
                type="button"
                onClick={() => onToggleDefect(d)}
                className="hover:text-red-900 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input Box */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchDefectPlaceholder") || "Search defect name or code..."}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Defect List (Multi-Select Scrollable Area) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredDefects.length === 0 ? (
          <div className="text-center py-8 px-4 text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <p>No matching defect found for "{searchTerm}"</p>
            <button
              type="button"
              onClick={() => {
                setNewDefectName(searchTerm);
                setShowAddModal(true);
              }}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add "{searchTerm || "New Defect"}"</span>
            </button>
          </div>
        ) : (
          filteredDefects.map((defect) => {
            const isSelected = selectedDefects.some(
              (sd) => sd._id === defect._id || sd.code === defect.code
            );

            return (
              <div
                key={defect._id || defect.code}
                onClick={() => onToggleDefect(defect)}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer select-none transition-all ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-600/25 border border-blue-400 dark:border-blue-500/60 text-blue-700 dark:text-white font-semibold"
                    : "bg-slate-50 dark:bg-slate-850/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>

                  <div className="truncate">
                    <span className="block truncate text-slate-900 dark:text-slate-100 font-medium">
                      {getLocalizedName(defect.name, defect.code)}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {defect.code} • {defect.category}
                    </span>
                  </div>
                </div>

                {defect.isCustom && (
                  <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 whitespace-nowrap">
                    Manual
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Sewing Operation & Notes Section */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
        <div>
          <label className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Scissors className="w-3.5 h-3.5 text-blue-500" />
            <span>{t("selectOperation") || "Sewing Operation"}</span>
          </label>
          <select
            value={selectedOperation}
            onChange={(e) => onSelectOperation(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="General / Not Specified">-- General / Not Specified --</option>
            {operationsList?.map((op) => (
              <option key={op.code} value={op.name?.en || op.code}>
                {op.code} - {getLocalizedName(op.name, op.code)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="text"
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder={t("notesPlaceholder") || "Notes / Alteration instructions..."}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* In-Line Modal to Add Custom Defect Manually */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>{t("addCustomDefectBtn") || "Add Custom Defect"}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDefect} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Defect Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newDefectName}
                  onChange={(e) => setNewDefectName(e.target.value)}
                  placeholder={t("customDefectPlaceholder") || "e.g. Broken Thread on Pocket"}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t("category") || "Category"}
                </label>
                <select
                  value={newDefectCategory}
                  onChange={(e) => setNewDefectCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
                >
                  {t("cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew || !newDefectName.trim()}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
                >
                  {isSubmittingNew ? "Saving..." : (t("saveCustomDefect") || "Save Defect")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
