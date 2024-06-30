import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@radix-ui/react-tooltip"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/v1/logs": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/api/v1/metrics": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/api/v1/traces": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/api/v2/traces": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
