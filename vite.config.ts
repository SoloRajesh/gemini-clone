import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import svgr from "vite-plugin-svgr";

config();

export default defineConfig({
  base: "/",
  plugins: [react(), svgr()],
  server: { host: true },
  define: {
    "process.env": process.env,
  },
});
