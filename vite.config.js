import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiTarget = process.env.VITE_API_TARGET || "http://127.0.0.1:5000";

const proxyConfig = {
  target: apiTarget,
  changeOrigin: true,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/api": proxyConfig,
      "/uploads": proxyConfig,
    },
  },
});
