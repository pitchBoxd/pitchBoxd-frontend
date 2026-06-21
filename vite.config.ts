import { defineConfig, loadEnv } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const API_TARGET = env.VITE_API_BASE_URL || "http://localhost:8080";

  return {
    server: {
      host: "::",
      port: 3000,
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
  };
});
