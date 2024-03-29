import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import wasm from "vite-plugin-wasm";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import VitePluginInjectPreload from 'vite-plugin-inject-preload';
import topLevelAwait from "vite-plugin-top-level-await";
// import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePluginInjectPreload({
      files: [
        {
          match: /preload\/(.*).webp$/
        },
      ]
    }),
    // viteCompression({
    //   threshold: 10000000 // 50kb
    // }),
    wasm(),
    topLevelAwait(),
    react(),
    nodePolyfills(),
  ],
  worker: {
    format: 'es',
    plugins: () => [
      wasm(),
      topLevelAwait(),
    ],
  },
  // worker: {
  //   format: "es"
  // },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  define: {
    'process.env': {}
  }
})
