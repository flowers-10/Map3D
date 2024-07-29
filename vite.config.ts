import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "",
  // publicDir: "./public",
  assetsInclude: ["**/*.glb", "**/*.hdr", "**/*.mp3", "**/*.ico", "**/*.svg"],
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
  build: {
    rollupOptions: {
      manualChunks(id) {
        if (id.includes("node_modules")) {
          return id
            .toString()
            .split("node_modules/")[1]
            .split("/")[0]
            .toString();
        }
      },
      output: {
        assetFileNames: (assetInfo: any) => {
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(assetInfo.name)) {
            return `media/[name].[hash][ext]`; 
          }
          // else if (/\.(glb|hdr)$/.test(assetInfo.name)) { // 匹配资源文件后缀 可以自定义存放位置
          return `assets/[name]-[hash].[ext]`; // 不匹配的资源文件存放至assets，以[name]-[hash].[ext]命名规则，注意两处的命名规则不同
        },
      },
    },
  },

  plugins: [vue()],
});
