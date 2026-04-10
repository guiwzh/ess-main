import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock([
  {
    url: '/api/auth/login',
    method: 'POST',
    delay: 300,
    body({ body }) {
      if (body.username === 'admin' && body.password === 'admin123') {
        return {
          code: 0,
          message: 'ok',
          data: {
            accessToken: 'mock-access-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
          },
        }
      }
      return {
        code: 401,
        message: '用户名或密码错误',
        data: null,
      }
    },
  },
  {
    url: '/api/auth/refresh',
    method: 'POST',
    delay: 100,
    body: {
      code: 0,
      message: 'ok',
      data: {
        accessToken: 'mock-access-token-refreshed-' + Date.now(),
        refreshToken: 'mock-refresh-token-refreshed-' + Date.now(),
      },
    },
  },
])
