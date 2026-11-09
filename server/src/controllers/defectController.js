import { DefectType } from "../models/DefectType.js";

// Get all active defect types
export const getDefects = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { active: true };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { "name.en": { $regex: search, $options: "i" } },
        { "name.ta": { $regex: search, $options: "i" } },
        { "name.hi": { $regex: search, $options: "i" } },
        { "name.or": { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    const defects = await DefectType.find(filter).sort({ isCustom: 1, "name.en": 1 });
    res.json(defects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add custom defect manually from inspector tablet dropdown
export const addCustomDefect = async (req, res) => {
  try {
    const { name, category, severity, inspectorName, language = "en" } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Defect name is required" });
    }

    const trimmedName = name.trim();

    // Check if defect with same English name exists
    const existing = await DefectType.findOne({
      $or: [
        { "name.en": { $regex: `^${trimmedName}$`, $options: "i" } },
        { "name.ta": { $regex: `^${trimmedName}$`, $options: "i" } },
        { "name.hi": { $regex: `^${trimmedName}$`, $options: "i" } },
        { "name.or": { $regex: `^${trimmedName}$`, $options: "i" } },
      ],
    });

    if (existing) {
      return res.status(200).json({
        message: "Defect already exists",
        defect: existing,
        alreadyExisted: true,
      });
    }

    // Generate unique code
    const count = await DefectType.countDocuments();
    const code = `CUST-${String(count + 1).padStart(3, "0")}`;

    const newDefect = new DefectType({
      code,
      name: {
        en: trimmedName,
        ta: language === "ta" ? trimmedName : "",
        hi: language === "hi" ? trimmedName : "",
        or: language === "or" ? trimmedName : "",
      },
      category: category || "Other",
      severity: severity || "Major",
      isCustom: true,
      addedBy: inspectorName || "QC Inspector",
      active: true,
    });

    await newDefect.save();

    res.status(201).json({
      success: true,
      message: "Custom defect added successfully",
      defect: newDefect,
    });
  } catch (error) {
    console.error("Error creating custom defect:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete defect
export const deleteDefect = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DefectType.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Defect not found" });
    res.json({ success: true, message: "Defect deleted", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


