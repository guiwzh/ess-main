import { defineMock } from 'vite-plugin-mock-dev-server'

/** 数据分析 API Mock（sub-analysis 独立模式） */
export default defineMock([
  {
    url: '/api/analysis/energy-stats',
    delay: 200,
    body: {
      code: 0,
      message: 'ok',
      data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        charge: [1200, 1350, 1100, 1400, 1600, 1500],
        discharge: [1100, 1250, 1000, 1300, 1500, 1400],
      },
    },
  },
  {
    url: '/api/analysis/efficiency',
    delay: 200,
    body: {
      code: 0,
      message: 'ok',
      data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        efficiency: [92.5, 93.1, 91.8, 94.2, 93.6, 94.8],
      },
    },
  },
  {
    url: '/api/analysis/revenue',
    delay: 200,
    body: {
      code: 0,
      message: 'ok',
      data: {
        composition: [
          { name: '峰时收益', value: 4500 },
          { name: '平时收益', value: 2800 },
          { name: '谷时收益', value: 1200 },
          { name: '补贴收入', value: 600 },
        ],
        monthly: {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
          values: [8.2, 9.1, 7.8, 10.5, 11.2, 10.8],
        },
      },
    },
  },
  {
    url: '/api/analysis/battery-health',
    delay: 200,
    body: {
      code: 0,
      message: 'ok',
      data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        soc: [85, 82, 88, 80, 86, 83],
        soh: [98.5, 98.3, 98.1, 97.9, 97.7, 97.5],
      },
    },
  },
])
