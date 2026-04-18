import { defineConfig } from 'orval'

export default defineConfig({
  'ess-api': {
    input: {
      // Swagger/OpenAPI 端点（部署后替换为实际地址）
      target: './swagger.json',
    },
    output: {
      // 生成的 API 文件输出目录
      target: './src/services/generated',
      // 使用 axios 作为 HTTP 客户端
      client: 'axios',
      // 覆盖已有文件
      override: {
        mutator: {
          path: './src/utils/request.ts',
          name: 'default',
        },
      },
    },
  },
})
