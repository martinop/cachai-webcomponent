import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { compression } from "vite-plugin-compression2";
import path from "path";

export default defineConfig({
  plugins: [react(), compression()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.tsx"),
      name: "trendfitWC",
      fileName: () => `index.js`,
      formats: ["iife"],
    },
    rollupOptions: {
      input: "src/main.tsx",
      output: {
        entryFileNames: `index.js`,
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
