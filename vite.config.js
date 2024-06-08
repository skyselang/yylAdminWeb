import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const pathSrc = resolve(__dirname, 'src')
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_APP_BASE,
    resolve: {
      alias: {
        '@': pathSrc,
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 9527,
      open: true
    },
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', 'vue-router', 'vue-i18n', 'pinia', '@vueuse/core'],
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [ElementPlusResolver(), IconsResolver({})],
        vueTemplate: true,
        dts: false
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({ enabledCollections: ['ep'] })
        ],
        // 指定自定义组件位置(默认:src/components)
        dirs: ['src/components', 'src/**/components'],
        // 配置文件位置 (false:关闭自动生成)
        dts: false
      }),
      Icons({
        autoInstall: true
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(pathSrc, 'assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'vue-i18n',
        'pinia',
        'axios',
        'crypto-js',
        'js-cookie',
        'nprogress',
        'path-to-regexp',
        'path-browserify',
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'element-plus/es/components/affix/style/css',
        'element-plus/es/components/alert/style/css',
        'element-plus/es/components/avatar/style/css',
        'element-plus/es/components/breadcrumb-item/style/css',
        'element-plus/es/components/breadcrumb/style/css',
        'element-plus/es/components/button/style/css',
        'element-plus/es/components/card/style/css',
        'element-plus/es/components/cascader/style/css',
        'element-plus/es/components/checkbox-group/style/css',
        'element-plus/es/components/checkbox/style/css',
        'element-plus/es/components/col/style/css',
        'element-plus/es/components/config-provider/style/css',
        'element-plus/es/components/color-picker/style/css',
        'element-plus/es/components/date-picker/style/css',
        'element-plus/es/components/dialog/style/css',
        'element-plus/es/components/divider/style/css',
        'element-plus/es/components/dropdown-item/style/css',
        'element-plus/es/components/dropdown-menu/style/css',
        'element-plus/es/components/dropdown/style/css',
        'element-plus/es/components/descriptions/style/css',
        'element-plus/es/components/descriptions-item/style/css',
        'element-plus/es/components/empty/style/css',
        'element-plus/es/components/form-item/style/css',
        'element-plus/es/components/form/style/css',
        'element-plus/es/components/icon/style/css',
        'element-plus/es/components/image/style/css',
        'element-plus/es/components/input-number/style/css',
        'element-plus/es/components/input/style/css',
        'element-plus/es/components/link/style/css',
        'element-plus/es/components/loading/style/css',
        'element-plus/es/components/menu-item/style/css',
        'element-plus/es/components/menu/style/css',
        'element-plus/es/components/notification/style/css',
        'element-plus/es/components/option/style/css',
        'element-plus/es/components/pagination/style/css',
        'element-plus/es/components/popover/style/css',
        'element-plus/es/components/radio-button/style/css',
        'element-plus/es/components/radio-group/style/css',
        'element-plus/es/components/radio/style/css',
        'element-plus/es/components/rate/style/css',
        'element-plus/es/components/row/style/css',
        'element-plus/es/components/scrollbar/style/css',
        'element-plus/es/components/select/style/css',
        'element-plus/es/components/statistic/style/css',
        'element-plus/es/components/sub-menu/style/css',
        'element-plus/es/components/switch/style/css',
        'element-plus/es/components/tab-pane/style/css',
        'element-plus/es/components/table-column/style/css',
        'element-plus/es/components/table/style/css',
        'element-plus/es/components/tabs/style/css',
        'element-plus/es/components/tag/style/css',
        'element-plus/es/components/text/style/css',
        'element-plus/es/components/tooltip/style/css',
        'element-plus/es/components/tree-select/style/css',
        'element-plus/es/components/tree/style/css',
        'element-plus/es/components/upload/style/css'
      ]
    },
    // 构建配置
    build: {
      outDir: env.VITE_APP_OUT_DIR,
      chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
      minify: 'terser', // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
      terserOptions: {
        compress: {
          keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: true, // 生产环境去除 console
          drop_debugger: true // 生产环境去除 debugger
        },
        format: {
          comments: false // 删除注释
        }
      },
      rollupOptions: {
        output: {
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: 'js/[name].[hash].js',
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: 'js/[name].[hash].js',
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            let extType = info[info.length - 1]
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'media'
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = 'img'
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'fonts'
            }
            return `${extType}/[name].[hash].[ext]`
          }
        }
      }
    }
  }
})
