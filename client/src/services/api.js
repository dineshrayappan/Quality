const BASE_URL = "/api";

/** Build a query string while omitting unset filter values. */
const toQueryString = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });
  const query = params.toString();
  return query ? `?${query}` : "";
};

/** Send an API request and throw a descriptive error on non-2xx responses. */
const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof data === "object" && (data?.error || data?.message)) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
};

const jsonRequest = (path, method, body) =>
  request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const api = {
  // Lines
  getLines: () => request("/lines"),
  createLine: (data) => jsonRequest("/lines", "POST", data),
  deleteLine: (id) => request(`/lines/${id}`, { method: "DELETE" }),

  // Tech Packs
  getTechPacks: () => request("/techpacks"),
  getTechPack: (styleNumber) => request(`/techpacks/${styleNumber}`),
  createTechPack: (data) => jsonRequest("/techpacks", "POST", data),
  updateTechPack: (id, data) => jsonRequest(`/techpacks/${id}`, "PUT", data),
  deleteTechPack: (id) => request(`/techpacks/${id}`, { method: "DELETE" }),
  uploadTechPackImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/techpacks/upload-image", {
      method: "POST",
      body: formData,
    });
  },

  // Defects
  getDefects: (category = "") => {
    const query = category && category !== "All" ? toQueryString({ category }) : "";
    return request(`/defects${query}`);
  },
  addCustomDefect: (data) => jsonRequest("/defects/custom", "POST", data),
  deleteDefect: (id) => request(`/defects/${id}`, { method: "DELETE" }),

  // QC Actions
  logPass: (data) => jsonRequest("/qc/pass", "POST", data),
  logDefect: (data) => jsonRequest("/qc/defect", "POST", data),
  logReject: (data) => jsonRequest("/qc/reject", "POST", data),
  getRecentLogs: (filters = {}, styleNumber) => {
    const resolvedFilters =
      typeof filters === "string"
        ? { lineName: filters, styleNumber }
        : filters;
    return request(`/qc/recent${toQueryString(resolvedFilters)}`);
  },
  deleteLog: (id) => request(`/qc/logs/${id}`, { method: "DELETE" }),

  // Analytics
  getSummary: (filters = {}) =>
    request(`/analytics/summary${toQueryString(filters)}`),
  getDefectPieChart: (filters = {}) =>
    request(`/analytics/defect-pie${toQueryString(filters)}`),
  getOperationDefects: (filters = {}) =>
    request(`/analytics/operations${toQueryString(filters)}`),
  getHeatmapPoints: (filters = {}) =>
    request(`/analytics/heatmap${toQueryString(filters)}`),
  getHourlyTrend: (filters = {}) =>
    request(`/analytics/hourly${toQueryString(filters)}`),
};
