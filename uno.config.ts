import { defineConfig, presetUno } from 'unocss'
import presetAnimations from 'unocss-preset-animations';
import { presetShadcn} from 'unocss-preset-shadcn';

export default defineConfig({
  // UnoCSS options
  presets: [
    presetUno(),
    presetAnimations(),
    presetShadcn({
      // color: 'red',
      // With default setting for SolidUI, you need to set the darkSelector option.
      darkSelector: '[data-kb-theme="dark"]',
    }),
  ],
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        '(components|src)/**/*.{js,ts}',
      ],
    },
  },
  theme: {
    container: {
      center: true,
      padding: '2rem',
      maxWidth: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1120px',
        '2xl': '1536px',
      },
    },
  },
})