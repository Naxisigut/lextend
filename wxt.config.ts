import { defineConfig } from 'wxt';
import UnoCSS from 'unocss/vite'
import path from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [UnoCSS()],
    resolve: {
      alias: {
        '@newtab': path.resolve(__dirname, 'entrypoints/newtab'),
        '@popup': path.resolve(__dirname, 'entrypoints/popup'),
      },
    },
  }),
});
