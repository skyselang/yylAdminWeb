import {
  defineConfig,
  presetUno,
  presetIcons,
  presetWebFonts,
  presetTypography,
  presetAttributify,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: 'var(--el-color-primary)',
      primary_dark: 'var(--el-color-primary-light-5)'
    }
  },
  presets: [presetUno(), presetIcons(), presetWebFonts(), presetTypography(), presetAttributify()],
  transformers: [transformerDirectives(), transformerVariantGroup()]
})
