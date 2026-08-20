import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Build optimization for SEO and performance
  build: {
    target: "es2020",
    outDir: "dist",
    sourcemap: false, // Disable source maps in production
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["framer-motion", "react-icons", "react-hot-toast"],
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },

  // Server configuration
  server: {
    port: 5173,
  },
});
