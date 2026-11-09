const BASE_URL = "/api";

export const api = {
  // Lines
  getLines: async () => {
    const res = await fetch(`${BASE_URL}/lines`);
    return res.json();
  },
  createLine: async (data) => {
    const res = await fetch(`${BASE_URL}/lines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteLine: async (id) => {
    const res = await fetch(`${BASE_URL}/lines/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // Tech Packs
  getTechPacks: async () => {
    const res = await fetch(`${BASE_URL}/techpacks`);
    return res.json();
  },
  getTechPack: async (styleNumber) => {
    const res = await fetch(`${BASE_URL}/techpacks/${styleNumber}`);
    return res.json();
  },
  createTechPack: async (data) => {
    const res = await fetch(`${BASE_URL}/techpacks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateTechPack: async (id, data) => {
    const res = await fetch(`${BASE_URL}/techpacks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteTechPack: async (id) => {
    const res = await fetch(`${BASE_URL}/techpacks/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
  uploadTechPackImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${BASE_URL}/techpacks/upload-image`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  },

  // Defects
  getDefects: async (category = "") => {
    const url = category && category !== "All" ? `${BASE_URL}/defects?category=${category}` : `${BASE_URL}/defects`;
    const res = await fetch(url);
    return res.json();
  },
  addCustomDefect: async (data) => {
    const res = await fetch(`${BASE_URL}/defects/custom`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteDefect: async (id) => {
    const res = await fetch(`${BASE_URL}/defects/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // QC Actions
  logPass: async (data) => {
    const res = await fetch(`${BASE_URL}/qc/pass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  logDefect: async (data) => {
    const res = await fetch(`${BASE_URL}/qc/defect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getRecentLogs: async (lineName = "", styleNumber = "") => {
    const params = new URLSearchParams();
    if (lineName) params.append("lineName", lineName);
    if (styleNumber) params.append("styleNumber", styleNumber);
    const res = await fetch(`${BASE_URL}/qc/recent?${params.toString()}`);
    return res.json();
  },
  deleteLog: async (id) => {
    const res = await fetch(`${BASE_URL}/qc/logs/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // Analytics
  getSummary: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/analytics/summary?${params.toString()}`);
    return res.json();
  },
  getDefectPieChart: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/analytics/defect-pie?${params.toString()}`);
    return res.json();
  },
  getOperationDefects: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/analytics/operations?${params.toString()}`);
    return res.json();
  },
  getHeatmapPoints: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/analytics/heatmap?${params.toString()}`);
    return res.json();
  },
  getHourlyTrend: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/analytics/hourly?${params.toString()}`);
    return res.json();
  },
};
