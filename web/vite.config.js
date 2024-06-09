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
      // "/api/v1/log": {
      //   target: "http://139.59.252.251:3100",
      //   changeOrigin: true,
      //   rewrite: (p) => p.replace(/^\/api\/v1\/log/, "/loki/api/v1/"),
      // },
      // "/api/v1/log": {
      //   target:
      //     "https://play.grafana.org/api/datasources/uid/grafanacloud-logs/resources",
      //   changeOrigin: true,
      //   rewrite: (p) => p.replace(/^\/api\/v1\/log/, "/"),
      // },
      "/api/v1/log": {
        target:
          "https://play.grafana.org/api/datasources/uid/ddhr3fttaw8aod/resources",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/v1\/log/, "/"),
      },

      // "/api/v1/metric": {
      //   target: "http://139.59.252.251:9009",
      //   changeOrigin: true,
      //   rewrite: (p) => p.replace(/^\/api\/v1\/metric/, "/prometheus/api/v1/"),
      // },
      "/api/v1/metric": {
        target:
          "https://play.grafana.org/api/datasources/uid/grafanacloud-prom/resources",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/v1\/metric/, "/api/v1/"),
      },

      "/api/v1/trace": {
        target: "http://139.59.252.251:3200",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/v1\/trace/, "/api/"),
      },
      "/api/v2/trace": {
        target: "http://139.59.252.251:3200",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/v2\/trace/, "/api/v2/"),
      },
      // "/api/v1/trace": {
      //   target:
      //     "https://play.grafana.org/api/datasources/proxy/uid/grafanacloud-traces",
      //   changeOrigin: true,
      //   rewrite: (p) => p.replace(/^\/api\/v1\/trace/, "/api/"),
      // },
      // "/api/v2/trace": {
      //   target:
      //     "https://play.grafana.org/api/datasources/proxy/uid/grafanacloud-traces",
      //   changeOrigin: true,
      //   rewrite: (p) => p.replace(/^\/api\/v2\/trace/, "/api/v2/"),
      // },
    },
  },
});
