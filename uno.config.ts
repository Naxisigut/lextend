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
  shortcuts: [
    // [/^btn-(.*)$/, ([, c]) => `bg-[${c}] text-white`],
  ],
  theme: {
    animation: {
      keyframes: {
        // rainbow: "{0% {--vp-c-brand-1: #00a98e;--vp-c-brand-next: #009ff7} 100% {--vp-c-brand-1: #ef5992;--vp-c-brand-next: #c6811e}}",
      },
      durations: {
        // rainbow: '6s',
      },
      timingFns: {
        // rainbow: 'linear',
      },
      counts: {
        // rainbow: "infinite",
      },
    },
    // container类在各个断点的最大宽度
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