import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // This binds the server to 0.0.0.0, allowing external access
    port: process.env.PORT || 5173, // Use the environment port or default to 5173
  },
});
