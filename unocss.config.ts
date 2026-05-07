import {
  defineConfig,
  presetIcons,
  presetMini,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import { themeColors } from './src/utils/config/uno-theme';

export default defineConfig({
  presets: [
    presetMini(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        clarity: () => import('@iconify-json/clarity/icons.json'),
        mdi: () => import('@iconify-json/mdi/icons.json'),
      },
    }),
    presetWebFonts({
      provider: 'google',
      inlineImports: false,
      fonts: {
        sans: {
          name: 'Inter',
          weights: ['300', '400', '500', '600', '700', '800'],
        },
        headline: {
          name: 'Inter',
          weights: ['300', '400', '500', '600', '700', '800'],
        },
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: themeColors,
});
