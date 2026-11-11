import { TechPack } from "../models/TechPack.js";

// List all active tech packs
export const getTechPacks = async (req, res) => {
  try {
    const techPacks = await TechPack.find({ active: true }).sort({ updatedAt: -1 });
    res.json(techPacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single tech pack by style number
export const getTechPackByStyle = async (req, res) => {
  try {
    const { styleNumber } = req.params;
    const techPack = await TechPack.findOne({ styleNumber });
    if (!techPack) {
      return res.status(404).json({ error: "Tech Pack not found for style " + styleNumber });
    }
    res.json(techPack);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new tech pack
export const createTechPack = async (req, res) => {
  try {
    const { styleNumber, buyer, itemType, description, views, operations, orderQty, season, imageUrl } = req.body;

    if (!styleNumber || !buyer) {
      return res.status(400).json({ error: "Style number and Buyer are required" });
    }

    const cleanStyle = styleNumber.trim().toUpperCase();
    const existing = await TechPack.findOne({ styleNumber: cleanStyle });
    if (existing) {
      return res.status(400).json({ error: `Style number ${cleanStyle} already exists` });
    }

    // Determine views based on provided views or imageUrl
    let formattedViews = [];
    if (Array.isArray(views) && views.length > 0) {
      formattedViews = views;
    } else if (imageUrl) {
      formattedViews = [
        { viewName: "Front", imageUrl },
        { viewName: "Back", imageUrl }
      ];
    } else {
      formattedViews = [
        { viewName: "Front", imageUrl: "" },
        { viewName: "Back", imageUrl: "" }
      ];
    }

    const techPack = new TechPack({
      styleNumber: cleanStyle,
      buyer: buyer.trim(),
      itemType: itemType || "Garment",
      description: description || "",
      season: season || "Current Season",
      orderQty: orderQty ? Number(orderQty) : 1000,
      imageUrl: imageUrl || (formattedViews[0]?.imageUrl || ""),
      views: formattedViews,
      operations: operations || [],
      active: true,
    });

    await techPack.save();
    res.status(201).json(techPack);
  } catch (error) {
    console.error("Error creating tech pack:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update existing tech pack (e.g. updating image, operations, or details)
export const updateTechPack = async (req, res) => {
  try {
    const { id } = req.params;
    const { buyer, itemType, description, views, operations, orderQty, season, imageUrl } = req.body;

    const techPack = await TechPack.findById(id);
    if (!techPack) {
      return res.status(404).json({ error: "Tech Pack not found" });
    }

    if (buyer) techPack.buyer = buyer;
    if (itemType) techPack.itemType = itemType;
    if (description !== undefined) techPack.description = description;
    if (season) techPack.season = season;
    if (orderQty !== undefined) techPack.orderQty = Number(orderQty);
    if (imageUrl) techPack.imageUrl = imageUrl;
    if (views && Array.isArray(views)) techPack.views = views;
    if (operations && Array.isArray(operations)) techPack.operations = operations;

    await techPack.save();
    res.json(techPack);
  } catch (error) {
    console.error("Error updating tech pack:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete tech pack
export const deleteTechPack = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TechPack.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Tech Pack not found" });
    }
    res.json({ success: true, message: "Tech pack deleted", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload Tech Pack Image file
export const uploadTechPackImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    const imageUrl = req.file.buffer
      ? `data:${req.file.mimetype || "image/png"};base64,${req.file.buffer.toString("base64")}`
      : `/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
