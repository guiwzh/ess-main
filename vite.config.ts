import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import Font from 'vite-plugin-font'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      mockDevServerPlugin({ prefix: '^/api' }),
      Font.vite({
        include: [/\.otf/, /\.ttf/, /\.woff2/],
        // 注意：不使用 scanFiles/?subsets 模式
        // 因为 i18n 翻译通过 HTTP 运行时加载，静态扫描无法覆盖动态文本
        // 当前使用全量 unicode-range 分片，浏览器按需加载
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {},
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  }
})
