import React, { useState, useEffect } from "react";
import { useTranslation } from "../i18n/LanguageContext";
import { api } from "../services/api";
import { AlertTriangle, Plus, Search, Tag, Check, Sparkles, X, Trash2 } from "lucide-react";

export const DefectMasterPage = () => {
  const { t, getLocalizedName, language } = useTranslation();
  const [defects, setDefects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [nameEn, setNameEn] = useState("");
  const [nameTa, setNameTa] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [nameOr, setNameOr] = useState("");
  const [category, setCategory] = useState("Stitching");
  const [severity, setSeverity] = useState("Major");

  useEffect(() => {
    loadDefects();
  }, []);

  const loadDefects = async () => {
    try {
      const data = await api.getDefects();
      setDefects(data || []);
    } catch (err) {
      console.error("Error loading defects:", err);
    }
  };

  const handleCreateDefect = async (e) => {
    e.preventDefault();
    if (!nameEn.trim()) return;

    try {
      await api.addCustomDefect({
        name: nameEn.trim(),
        category,
        severity,
        language,
        inspectorName: "System Admin",
      });

      setShowAddModal(false);
      setNameEn("");
      setNameTa("");
      setNameHi("");
      setNameOr("");
      await loadDefects();
    } catch (err) {
      alert("Failed to add defect: " + err.message);
    }
  };

  const handleDeleteDefect = async (id, name) => {
    if (!window.confirm(`Delete defect "${name}"?`)) return;
    try {
      await api.deleteDefect(id);
      await loadDefects();
    } catch (err) {
      alert("Failed to delete defect: " + err.message);
    }
  };

  const categories = [
    "All",
    "Stitching",
    "Fabric",
    "Stain / Soil",
    "Trims / Accessories",
    "Measurement",
    "Other",
  ];

  const filtered = defects.filter((d) => {
    const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const locName = getLocalizedName(d.name, d.code).toLowerCase();
    const enName = (d.name?.en || "").toLowerCase();
    const code = (d.code || "").toLowerCase();
    const matchesSearch = !q || locName.includes(q) || enName.includes(q) || code.includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-3">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
            <span>{t("masterTitle") || "Defect Master Library"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t("masterSub") || "Multi-lingual standard and custom apparel export defect catalogue"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addDefect") || "New Defect"}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("searchPlaceholder") || "Search defect name or code..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Defects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              No defect types found in this category.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Create Defect
            </button>
          </div>
        ) : (
          filtered.map((d) => {
            const localized = getLocalizedName(d.name, d.code);
            return (
              <div
                key={d._id || d.code}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {d.code}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          d.severity === "Critical"
                            ? "bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400"
                            : d.severity === "Major"
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                            : "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {d.severity}
                      </span>
                      {d._id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteDefect(d._id, localized)}
                          className="p-1 rounded text-slate-400 hover:text-red-500"
                          title="Delete defect"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                    {localized}
                  </h3>
                  {d.name?.en && d.name.en !== localized && (
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{d.name.en}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                    {d.category}
                  </span>
                  <span>{d.isCustom ? "Custom Added" : "Export Standard"}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Defect Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Add Defect Type
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDefect} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Defect Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Needle Cut / Hole"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Stitching">Stitching</option>
                    <option value="Fabric">Fabric</option>
                    <option value="Stain / Soil">Stain / Soil</option>
                    <option value="Trims / Accessories">Trims / Accessories</option>
                    <option value="Measurement">Measurement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30"
                >
                  Save Defect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
