import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Build estático, independente do vite.config.ts (que é específico do
// runtime Cloudflare Workers/vinext). Gera um bundle simples de JS+CSS
// para ser servido como arquivo estático pelo Django.
export default defineConfig({
  root: dirname,
  plugins: [react()],
  resolve: {
    alias: {
      "@": dirname,
    },
  },
  build: {
    outDir: path.resolve(dirname, "dist-static"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(dirname, "index.static.html"),
    },
  },
});
