import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";


export default defineConfig({
  plugins: [vue(), tailwindcss()],

  esbuild: {
    target: "esnext", // Target the latest version for better performance
  },

  server: {
    hmr: true,
    watch: {
      usePolling: true, // Use polling for file watchers if needed
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Map "@" to "./src"
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@services": path.resolve(__dirname, "./src/services"),
    },
  },
});
