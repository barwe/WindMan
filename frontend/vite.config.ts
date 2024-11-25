import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoComponents from 'unplugin-vue-components/vite'
import AutoImports from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'

import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import IconResolver from 'unplugin-icons/resolver'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      AutoComponents({
        dts: 'src/types/auto-components.d.ts',
        resolvers: [NaiveUiResolver(), IconResolver()],
        globs: ['src/elements/*.vue'],
      }),
      AutoImports({
        imports: [
          'vue',
          {
            lodash: ['has', 'keys', 'values', 'entries', 'assign', 'pick', 'omit', 'debounce', 'isNil', 'isEmpty', 'cloneDeep'],
            '@/api/axio': [['default', 'axio']],
            '@/store/site': [['default', 'useSiteStore']],
            '@/store/conf': [['default', 'useConfStore']],
            '@/store/data': [['default', 'useDataStore']],
            '@/utils/css': ['px', 'mcalc'],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
      }),
      UnoCSS(),
      Icons({}),
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
      host: env.VITE_HOST,
      port: env.VITE_PORT as any,
      proxy: {
        '/api': {
          target: 'http://' + env.VITE_BASE_API,
          changeOrigin: true,
        },
        '/ws': {
          target: 'ws://' + env.VITE_BASE_API,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    build: {
      outDir: '../gui',
      emptyOutDir: true,
    },
  }
})
