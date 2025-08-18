import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Unocss from 'unocss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Unocss(),
    AutoImport({
      // 這些常用 API 會自動引入（不用每檔 import）
      imports: ['vue', 'vue-router', 'pinia'],
      // ✅ 也讓 Naive 的 composables（如 useMessage）自動引入
      resolvers: [NaiveUiResolver()],
      dts: 'src/auto-imports.d.ts',
      eslintrc: { enabled: false },
    }),
    // 自動按需引入「用到的」Naive 元件（不再手動維護清單）
    Components({
      resolvers: [NaiveUiResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
