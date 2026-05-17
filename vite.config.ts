import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import path from "path";

const API_TARGET = process.env.VITE_API_BASE_URL || "http://localhost:8080";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
  plugins: [reactRouter()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
