import { Line } from "../models/Line.js";

export const getLines = async (req, res) => {
  try {
    const lines = await Line.find({ active: true }).sort({ name: 1 });
    res.json(lines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLine = async (req, res) => {
  try {
    const { name, supervisor, targetHourly } = req.body;
    if (!name) return res.status(400).json({ error: "Line name is required" });

    const line = new Line({ name: name.trim(), supervisor: supervisor ? supervisor.trim() : "", targetHourly: targetHourly ? Number(targetHourly) : 80 });
    await line.save();
    res.status(201).json(line);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLine = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Line.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Line not found" });
    res.json({ success: true, message: "Line deleted", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
