import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

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
});


