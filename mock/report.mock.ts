import { defineMock } from 'vite-plugin-mock-dev-server'

const dailyReport = {
  date: '2025-01-15',
  summary: {
    totalCharge: 12500,
    totalDischarge: 11800,
    peakPower: 850,
    avgEfficiency: 93.2,
    revenue: 3.8,
  },
  hourly: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    charge: Math.round(300 + Math.random() * 200),
    discharge: Math.round(280 + Math.random() * 200),
    power: Math.round(500 + Math.random() * 400),
  })),
}

const monthlyReport = {
  month: '2025-01',
  summary: {
    totalCharge: 385000,
    totalDischarge: 362000,
    peakPower: 920,
    avgEfficiency: 93.8,
    revenue: 112.5,
  },
  daily: Array.from({ length: 31 }, (_, i) => ({
    date: `1月${i + 1}日`,
    charge: Math.round(10000 + Math.random() * 5000),
    discharge: Math.round(9500 + Math.random() * 5000),
    revenue: +(2 + Math.random() * 3).toFixed(1),
  })),
}

const indicators = [
  { key: 'charge', label: '充电量 (kWh)' },
  { key: 'discharge', label: '放电量 (kWh)' },
  { key: 'efficiency', label: '效率 (%)' },
  { key: 'revenue', label: '收益 (万元)' },
  { key: 'peakPower', label: '峰值功率 (kW)' },
  { key: 'soc', label: 'SOC (%)' },
  { key: 'soh', label: 'SOH (%)' },
]

export default defineMock([
  {
    url: '/api/analysis/report/daily',
    delay: 300,
    body: { code: 0, message: 'ok', data: dailyReport },
  },
  {
    url: '/api/analysis/report/monthly',
    delay: 300,
    body: { code: 0, message: 'ok', data: monthlyReport },
  },
  {
    url: '/api/analysis/report/indicators',
    delay: 100,
    body: { code: 0, message: 'ok', data: indicators },
  },
  {
    url: '/api/analysis/report/custom',
    delay: 500,
    body: (_req: { body: { indicators?: string[]; startDate?: string; endDate?: string } }) => {
      const labels = ['1月', '2月', '3月', '4月', '5月', '6月']
      const series: Record<string, number[]> = {
        charge: [12000, 13500, 11000, 14000, 16000, 15000],
        discharge: [11000, 12500, 10000, 13000, 15000, 14000],
        efficiency: [92.5, 93.1, 91.8, 94.2, 93.6, 94.8],
        revenue: [8.2, 9.1, 7.8, 10.5, 11.2, 10.8],
        peakPower: [820, 850, 790, 880, 920, 900],
        soc: [85, 82, 88, 80, 86, 83],
        soh: [98.5, 98.3, 98.1, 97.9, 97.7, 97.5],
      }
      return {
        code: 0,
        message: 'ok',
        data: { labels, series },
      }
    },
  },
])
