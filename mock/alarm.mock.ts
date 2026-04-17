import { defineMock } from 'vite-plugin-mock-dev-server'

const historyAlarms = [
  {
    id: 'h1',
    deviceCode: 'PCS-001',
    message: 'PCS-001 过温告警',
    level: 'critical',
    time: '2025-01-15 10:30:00',
    resolvedTime: '2025-01-15 11:00:00',
    station: '储能站点A',
  },
  {
    id: 'h2',
    deviceCode: 'BMS-001',
    message: 'BMS-001 通信中断',
    level: 'warning',
    time: '2025-01-14 08:20:00',
    resolvedTime: '2025-01-14 09:15:00',
    station: '储能站点A',
  },
  {
    id: 'h3',
    deviceCode: 'PCS-002',
    message: '系统巡检完成',
    level: 'info',
    time: '2025-01-13 10:00:00',
    resolvedTime: '2025-01-13 10:00:00',
    station: '储能站点B',
  },
  {
    id: 'h4',
    deviceCode: 'HVAC-001',
    message: 'HVAC-001 运行异常',
    level: 'warning',
    time: '2025-01-12 15:30:00',
    resolvedTime: '2025-01-12 16:00:00',
    station: '储能站点B',
  },
  {
    id: 'h5',
    deviceCode: 'PCS-001',
    message: 'PCS-001 电流过载',
    level: 'critical',
    time: '2025-01-11 16:20:00',
    resolvedTime: '2025-01-11 17:00:00',
    station: '储能站点A',
  },
  {
    id: 'h6',
    deviceCode: 'BMS-002',
    message: 'BMS-002 SOC异常',
    level: 'warning',
    time: '2025-01-10 14:10:00',
    resolvedTime: '2025-01-10 15:30:00',
    station: '储能站点B',
  },
  {
    id: 'h7',
    deviceCode: 'FIRE-001',
    message: '消防系统自检完成',
    level: 'info',
    time: '2025-01-09 06:00:00',
    resolvedTime: '2025-01-09 06:00:00',
    station: '储能站点C',
  },
  {
    id: 'h8',
    deviceCode: 'TRANS-001',
    message: '变压器温度过高',
    level: 'critical',
    time: '2025-01-08 13:45:00',
    resolvedTime: '2025-01-08 14:20:00',
    station: '储能站点A',
  },
]

const alarmRules = [
  {
    id: 'r1',
    name: 'PCS过温告警',
    deviceType: 'PCS',
    param: 'temperature',
    operator: '>',
    threshold: 55,
    level: 'critical',
    notifyMethod: 'sms',
    enabled: true,
  },
  {
    id: 'r2',
    name: 'BMS SOC过低',
    deviceType: 'BMS',
    param: 'soc',
    operator: '<',
    threshold: 10,
    level: 'warning',
    notifyMethod: 'email',
    enabled: true,
  },
  {
    id: 'r3',
    name: 'PCS电流过载',
    deviceType: 'PCS',
    param: 'current',
    operator: '>',
    threshold: 200,
    level: 'critical',
    notifyMethod: 'sms',
    enabled: true,
  },
  {
    id: 'r4',
    name: '空调温度异常',
    deviceType: 'HVAC',
    param: 'temperature',
    operator: '>',
    threshold: 40,
    level: 'warning',
    notifyMethod: 'email',
    enabled: false,
  },
]

export default defineMock([
  {
    url: '/api/operation/alarms/history',
    delay: 200,
    body({ query }) {
      const page = Number(query.current) || 1
      const pageSize = Number(query.pageSize) || 10
      const level = (query.level as string) || ''
      const station = (query.station as string) || ''

      let filtered = historyAlarms
      if (level) filtered = filtered.filter((a) => a.level === level)
      if (station) filtered = filtered.filter((a) => a.station === station)

      const start = (page - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)

      return {
        code: 0,
        message: 'ok',
        data: { list, total: filtered.length },
      }
    },
  },
  {
    url: '/api/operation/alarms/:id/confirm',
    method: 'POST',
    delay: 300,
    body: { code: 0, message: '确认成功', data: null },
  },
  {
    url: '/api/operation/alarms/:id/clear',
    method: 'POST',
    delay: 300,
    body: { code: 0, message: '消除成功', data: null },
  },
  {
    url: '/api/operation/alarm-rules',
    delay: 200,
    body: {
      code: 0,
      message: 'ok',
      data: alarmRules,
    },
  },
  {
    url: '/api/operation/alarm-rules',
    method: 'POST',
    delay: 300,
    body: { code: 0, message: '创建成功', data: { id: 'r' + Date.now() } },
  },
  {
    url: '/api/operation/alarm-rules/:id',
    method: 'PUT',
    delay: 300,
    body: { code: 0, message: '更新成功', data: null },
  },
  {
    url: '/api/operation/alarm-rules/:id',
    method: 'DELETE',
    delay: 300,
    body: { code: 0, message: '删除成功', data: null },
  },
])
