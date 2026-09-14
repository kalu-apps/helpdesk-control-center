import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev
export default defineConfig({
  base: "/helpdesk-system/",
  plugins: [react(), tailwindcss()],
});
