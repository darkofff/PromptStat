import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // jakby tanstack query dev-tools nie działały to odkomentować kod poniżej
  /* resolve: {
      dedupe: ["react", "react-dom"], // ← wymusza jedną instancję
    }, */
});
