import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Extension pages are loaded from chrome-extension://<id>/..., so all
// asset URLs must be relative. `base: "./"` makes Vite emit relative
// paths instead of absolute `/assets/...` paths that would break in the
// extension sandbox.
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        newtab: "index.html",
      },
    },
  },
});
