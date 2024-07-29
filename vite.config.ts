import { defineConfig } from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // base: "",
  // publicDir: "./public",
  assetsInclude: ["**/*.glb", "**/*.hdr", "**/*.mp3", "**/*.ico","**/*.svg"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // "@static": path.resolve(__dirname, "static"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@shaders": path.resolve(__dirname, "src/shaders"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
  plugins: [vue()],
})
