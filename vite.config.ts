import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import prefetchPlugin from "vite-plugin-bundle-prefetch";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), prefetchPlugin()],
  server: {
    port: 3000,
  },
});
