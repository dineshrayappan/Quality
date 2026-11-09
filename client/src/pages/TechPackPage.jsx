import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "../i18n/LanguageContext";
import { api } from "../services/api";
import {
  Shirt,
  Plus,
  Eye,
  Scissors,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";

export const TechPackPage = () => {
  const { t, getLocalizedName } = useTranslation();
  const [techPacks, setTechPacks] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [activeView, setActiveView] = useState("Front");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [newStyleNumber, setNewStyleNumber] = useState("");
  const [newBuyer, setNewBuyer] = useState("");
  const [newItemType, setNewItemType] = useState("Crew Neck T-Shirt");
  const [newSeason, setNewSeason] = useState("SS-2026");
  const [newOrderQty, setNewOrderQty] = useState(5000);
  const [newFrontImage, setNewFrontImage] = useState("");
  const [newBackImage, setNewBackImage] = useState("");
  const [imageUploadMethod, setImageUploadMethod] = useState("file"); // 'file', 'preset', 'url'
  const [selectedPreset, setSelectedPreset] = useState("tshirt");
  const [customOperations, setCustomOperations] = useState([
    { code: "OP-01", name: { en: "Shoulder Join" }, department: "Sewing" },
    { code: "OP-02", name: { en: "Neck Rib Attach" }, department: "Sewing" },
    { code: "OP-03", name: { en: "Sleeve Attach" }, department: "Sewing" },
    { code: "OP-04", name: { en: "Side Seam Close" }, department: "Sewing" },
    { code: "OP-05", name: { en: "Bottom Hemming" }, department: "Sewing" },
  ]);
  const [newOpCode, setNewOpCode] = useState("");
  const [newOpName, setNewOpName] = useState("");

  // Update image file input ref for existing tech pack
  const updateFileInputRef = useRef(null);

  useEffect(() => {
    loadTechPacks();
  }, []);

  const loadTechPacks = async () => {
    try {
      setLoading(true);
      const data = await api.getTechPacks();
      setTechPacks(data || []);
      if (data && data.length > 0) {
        setSelectedStyle((prev) => {
          if (!prev) return data[0];
          const found = data.find((tp) => tp._id === prev._id || tp.styleNumber === prev.styleNumber);
          return found || data[0];
        });
      } else {
        setSelectedStyle(null);
      }
    } catch (err) {
      console.error("Error loading tech packs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Convert File to base64 or upload to server
  const handleFileSelect = async (e, targetView = "front") => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // First try uploading file directly to backend
      const uploadRes = await api.uploadTechPackImage(file);
      if (uploadRes && uploadRes.imageUrl) {
        if (targetView === "front") setNewFrontImage(uploadRes.imageUrl);
        else setNewBackImage(uploadRes.imageUrl);
        return;
      }
    } catch (err) {
      console.warn("Server upload failed, converting to Data URL:", err);
    }

    // Fallback to Base64 data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      if (targetView === "front") setNewFrontImage(base64);
      else setNewBackImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // Update image on current active Tech Pack
  const handleUpdateCurrentTechPackImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedStyle) return;

    try {
      let finalImageUrl = "";
      try {
        const uploadRes = await api.uploadTechPackImage(file);
        if (uploadRes && uploadRes.imageUrl) {
          finalImageUrl = uploadRes.imageUrl;
        }
      } catch (uploadErr) {
        // Fallback
      }

      if (!finalImageUrl) {
        finalImageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        });
      }

      // Update views
      const updatedViews = (selectedStyle.views || []).map((v) => {
        if (v.viewName === activeView) {
          return { ...v, imageUrl: finalImageUrl };
        }
        return v;
      });

      // If activeView was not in views, add it
      if (!updatedViews.some((v) => v.viewName === activeView)) {
        updatedViews.push({ viewName: activeView, imageUrl: finalImageUrl });
      }

      const updated = await api.updateTechPack(selectedStyle._id, {
        views: updatedViews,
        imageUrl: finalImageUrl,
      });

      setSelectedStyle(updated);
      await loadTechPacks();
      alert("Garment image updated successfully! This image will now be used in the defect heatmap.");
    } catch (err) {
      console.error("Error updating image:", err);
      alert("Failed to update tech pack image: " + err.message);
    }
  };

  // Add custom operation
  const handleAddOperation = () => {
    if (!newOpName.trim()) return;
    const code = newOpCode.trim() || `OP-${String(customOperations.length + 1).padStart(2, "0")}`;
    setCustomOperations([
      ...customOperations,
      { code, name: { en: newOpName.trim() }, department: "Sewing" },
    ]);
    setNewOpCode("");
    setNewOpName("");
  };

  // Remove operation
  const handleRemoveOperation = (index) => {
    setCustomOperations(customOperations.filter((_, i) => i !== index));
  };

  // Create Tech Pack submit
  const handleCreateTechPack = async (e) => {
    e.preventDefault();
    if (!newStyleNumber.trim() || !newBuyer.trim()) {
      alert("Style number and Buyer name are required");
      return;
    }

    try {
      let frontUrl = newFrontImage;
      let backUrl = newBackImage;

      // If using presets
      if (imageUploadMethod === "preset") {
        frontUrl = selectedPreset === "polo" ? "/techpacks/polo-front.svg" : "/techpacks/tshirt-front.svg";
        backUrl = selectedPreset === "polo" ? "/techpacks/polo-back.svg" : "/techpacks/tshirt-back.svg";
      }

      // If no front image provided, use preset
      if (!frontUrl) {
        frontUrl = "/techpacks/tshirt-front.svg";
      }
      if (!backUrl) {
        backUrl = frontUrl;
      }

      await api.createTechPack({
        styleNumber: newStyleNumber.trim().toUpperCase(),
        buyer: newBuyer.trim(),
        itemType: newItemType.trim(),
        season: newSeason.trim(),
        orderQty: Number(newOrderQty) || 1000,
        imageUrl: frontUrl,
        views: [
          { viewName: "Front", imageUrl: frontUrl },
          { viewName: "Back", imageUrl: backUrl },
        ],
        operations: customOperations,
      });

      setShowAddModal(false);
      setNewStyleNumber("");
      setNewBuyer("");
      setNewFrontImage("");
      setNewBackImage("");
      await loadTechPacks();
    } catch (err) {
      alert("Failed to create tech pack: " + err.message);
    }
  };

  // Delete Tech Pack
  const handleDeleteTechPack = async (id, styleNumber) => {
    if (!window.confirm(`Are you sure you want to delete Tech Pack ${styleNumber}?`)) return;
    try {
      await api.deleteTechPack(id);
      await loadTechPacks();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const currentViewObj =
    selectedStyle?.views?.find((v) => v.viewName === activeView) ||
    selectedStyle?.views?.[0];
  const activeImageUrl = currentViewObj?.imageUrl || selectedStyle?.imageUrl;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-3">
            <Shirt className="w-7 h-7 text-blue-600 dark:text-blue-500" />
            <span>Buyer Tech Packs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Garment specification sketches, buyer details, and sewing operations. Uploaded image is used directly in the defect heatmap.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Tech Pack</span>
        </button>
      </div>

      {/* Main Content: Left Styles List & Right Garment Sketch Details */}
      {techPacks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <Shirt className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              No Tech Packs Configured
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              Add your buyer style, order details, and upload your garment sketch image. The uploaded image will be rendered in the defect heatmap!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Tech Pack</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Styles List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Available Styles ({techPacks.length})
              </h2>
              <button
                type="button"
                onClick={loadTechPacks}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
              {techPacks.map((tp) => {
                const isSelected = selectedStyle?.styleNumber === tp.styleNumber;
                return (
                  <div
                    key={tp._id || tp.styleNumber}
                    onClick={() => setSelectedStyle(tp)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/80 dark:bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {tp.styleNumber}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
                        {tp.buyer}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 truncate">
                      {tp.itemType}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                      <span>Season: {tp.season || "SS-2026"}</span>
                      <span>{tp.operations?.length || 0} Operations</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Garment Sketch & Heatmap Image Source */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            {selectedStyle && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 transition-colors">
                
                {/* Style Header & Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        {selectedStyle.styleNumber}
                      </h2>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {selectedStyle.itemType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Buyer: <strong className="text-blue-600 dark:text-blue-400">{selectedStyle.buyer}</strong> • Season: {selectedStyle.season} • Order: {selectedStyle.orderQty?.toLocaleString() || "—"} pcs
                    </p>
                  </div>

                  {/* Actions: View Switcher & Delete */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      {["Front", "Back"].map((vName) => (
                        <button
                          key={vName}
                          type="button"
                          onClick={() => setActiveView(vName)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            activeView === vName
                              ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          {vName} View
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteTechPack(selectedStyle._id, selectedStyle.styleNumber)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 border border-transparent hover:border-red-200 dark:hover:border-red-900/40 transition-colors"
                      title="Delete Tech Pack"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Garment Image Sketch Container */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <ImageIcon className="w-4 h-4 text-blue-500" />
                      <span>Garment Image for Heatmap ({activeView} View)</span>
                    </div>

                    {/* Change / Upload Image Button */}
                    <div>
                      <input
                        type="file"
                        ref={updateFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpdateCurrentTechPackImage}
                      />
                      <button
                        type="button"
                        onClick={() => updateFileInputRef.current?.click()}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/30 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-500/30 transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload / Change Image</span>
                      </button>
                    </div>
                  </div>

                  {/* Garment Sketch Box */}
                  <div className="flex justify-center p-6 bg-slate-100/70 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="max-w-[420px] w-full aspect-[6/7] bg-white rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-center overflow-hidden">
                      {activeImageUrl ? (
                        <img
                          src={activeImageUrl}
                          alt={selectedStyle.styleNumber}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center space-y-2">
                          <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                          <p className="text-xs text-slate-500 font-medium">
                            No image uploaded for {activeView} view
                          </p>
                          <button
                            type="button"
                            onClick={() => updateFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs"
                          >
                            Upload Image Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    Note: This exact garment image will be rendered as the defect heatmap overlay in the TV dashboard and inspection canvas.
                  </p>
                </div>

                {/* Operations Sequence Breakdown */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                    <Scissors className="w-4 h-4 text-blue-500" />
                    <span>Sewing Line Operations ({selectedStyle.operations?.length || 0})</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedStyle.operations?.map((op, idx) => (
                      <div
                        key={op.code || idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {getLocalizedName(op.name, op.code)}
                            </span>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                              {op.code}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          {op.department || "Sewing"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create New Tech Pack Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Create Buyer Tech Pack
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Upload garment sketch image that will be shown in the defect heatmap
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTechPack} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Style / PO Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TSH-8820"
                    value={newStyleNumber}
                    onChange={(e) => setNewStyleNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white uppercase focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Buyer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Target, H&M, Zara, Primark"
                    value={newBuyer}
                    onChange={(e) => setNewBuyer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Item Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Men's Pique Polo / 100% Cotton T-Shirt"
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Order Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="5000"
                    value={newOrderQty}
                    onChange={(e) => setNewOrderQty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Garment Image Upload Option */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-slate-50/70 dark:bg-slate-950/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Garment Sketch Image (Viewed in Heatmap)
                  </label>
                  <div className="flex items-center space-x-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageUploadMethod("file")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        imageUploadMethod === "file"
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMethod("preset")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        imageUploadMethod === "preset"
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      Preset Outline
                    </button>
                  </div>
                </div>

                {imageUploadMethod === "file" ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Front Image File Input */}
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          id="frontImageUpload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e, "front")}
                        />
                        <label
                          htmlFor="frontImageUpload"
                          className="cursor-pointer flex flex-col items-center space-y-1.5"
                        >
                          {newFrontImage ? (
                            <img
                              src={newFrontImage}
                              alt="Front preview"
                              className="w-20 h-20 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white"
                            />
                          ) : (
                            <Upload className="w-6 h-6 text-blue-500" />
                          )}
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {newFrontImage ? "Change Front Image" : "Upload Front Sketch"}
                          </span>
                          <span className="text-[10px] text-slate-400">PNG, JPG, SVG, WebP</span>
                        </label>
                      </div>

                      {/* Back Image File Input */}
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          id="backImageUpload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e, "back")}
                        />
                        <label
                          htmlFor="backImageUpload"
                          className="cursor-pointer flex flex-col items-center space-y-1.5"
                        >
                          {newBackImage ? (
                            <img
                              src={newBackImage}
                              alt="Back preview"
                              className="w-20 h-20 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white"
                            />
                          ) : (
                            <Upload className="w-6 h-6 text-slate-400" />
                          )}
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {newBackImage ? "Change Back Image" : "Upload Back Sketch (Optional)"}
                          </span>
                          <span className="text-[10px] text-slate-400">If empty, front is used</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <select
                      value={selectedPreset}
                      onChange={(e) => setSelectedPreset(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    >
                      <option value="tshirt">Basic Crew Neck T-Shirt (Front & Back)</option>
                      <option value="polo">Polo Shirt with Collar & Placket (Front & Back)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Operations Sequence Builder */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Sewing Operations Sequence ({customOperations.length})
                </label>

                {/* Operations List */}
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {customOperations.map((op, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-blue-500 font-bold">{op.code}</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{op.name?.en || op.code}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveOperation(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Operation Row */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    placeholder="e.g. OP-06"
                    value={newOpCode}
                    onChange={(e) => setNewOpCode(e.target.value)}
                    className="w-24 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs uppercase"
                  />
                  <input
                    type="text"
                    placeholder="Operation name (e.g. Sleeve Hemming)"
                    value={newOpName}
                    onChange={(e) => setNewOpName(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddOperation}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30"
                >
                  Save Tech Pack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
