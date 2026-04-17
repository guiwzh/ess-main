import { defineMock } from 'vite-plugin-mock-dev-server'

const allDevices = [
  {
    id: '1',
    code: 'PCS-001',
    name: 'PCS变流器-1#',
    type: 'PCS',
    status: 'running',
    station: '储能站点A',
    ratedPower: '500kW',
    installDate: '2024-03-15',
  },
  {
    id: '2',
    code: 'BMS-001',
    name: '电池管理系统-1#',
    type: 'BMS',
    status: 'offline',
    station: '储能站点A',
    ratedPower: '-',
    installDate: '2024-03-15',
  },
  {
    id: '3',
    code: 'PCS-002',
    name: 'PCS变流器-2#',
    type: 'PCS',
    status: 'running',
    station: '储能站点B',
    ratedPower: '500kW',
    installDate: '2024-05-20',
  },
  {
    id: '4',
    code: 'HVAC-001',
    name: '空调机组-1#',
    type: 'HVAC',
    status: 'standby',
    station: '储能站点B',
    ratedPower: '50kW',
    installDate: '2024-05-20',
  },
  {
    id: '5',
    code: 'FIRE-001',
    name: '消防系统-1#',
    type: 'FIRE',
    status: 'running',
    station: '储能站点C',
    ratedPower: '-',
    installDate: '2024-06-01',
  },
  {
    id: '6',
    code: 'BMS-002',
    name: '电池管理系统-2#',
    type: 'BMS',
    status: 'running',
    station: '储能站点B',
    ratedPower: '-',
    installDate: '2024-05-20',
  },
  {
    id: '7',
    code: 'PCS-003',
    name: 'PCS变流器-3#',
    type: 'PCS',
    status: 'standby',
    station: '储能站点C',
    ratedPower: '250kW',
    installDate: '2024-06-01',
  },
  {
    id: '8',
    code: 'TRANS-001',
    name: '变压器-1#',
    type: 'TRANS',
    status: 'running',
    station: '储能站点A',
    ratedPower: '1000kVA',
    installDate: '2024-03-10',
  },
  {
    id: '9',
    code: 'HVAC-002',
    name: '空调机组-2#',
    type: 'HVAC',
    status: 'running',
    station: '储能站点C',
    ratedPower: '50kW',
    installDate: '2024-06-01',
  },
  {
    id: '10',
    code: 'FIRE-002',
    name: '消防系统-2#',
    type: 'FIRE',
    status: 'standby',
    station: '储能站点A',
    ratedPower: '-',
    installDate: '2024-03-15',
  },
]

const allAlarms = [
  {
    id: '1',
    deviceCode: 'PCS-001',
    message: 'PCS-001 过温告警',
    level: 'critical',
    time: '2025-01-15 10:30:00',
    status: 'active',
  },
  {
    id: '2',
    deviceCode: 'BMS-001',
    message: 'BMS-001 通信中断',
    level: 'warning',
    time: '2025-01-15 10:25:00',
    status: 'active',
  },
  {
    id: '3',
    deviceCode: 'PCS-002',
    message: '系统巡检完成',
    level: 'info',
    time: '2025-01-15 10:00:00',
    status: 'resolved',
  },
  {
    id: '4',
    deviceCode: 'HVAC-001',
    message: 'HVAC-001 运行异常',
    level: 'warning',
    time: '2025-01-15 09:45:00',
    status: 'active',
  },
  {
    id: '5',
    deviceCode: 'PCS-001',
    message: 'PCS-001 电流过载',
    level: 'critical',
    time: '2025-01-14 16:20:00',
    status: 'resolved',
  },
  {
    id: '6',
    deviceCode: 'BMS-002',
    message: 'BMS-002 SOC异常',
    level: 'warning',
    time: '2025-01-14 14:10:00',
    status: 'active',
  },
]

export default defineMock([
  {
    url: '/api/operation/devices',
    delay: 200,
    body({ query }) {
      const page = Number(query.current) || 1
      const pageSize = Number(query.pageSize) || 10
      const keyword = (query.keyword as string) || ''
      const type = (query.type as string) || ''

      let filtered = allDevices
      if (keyword) {
        filtered = filtered.filter((d) => d.name.includes(keyword) || d.code.includes(keyword))
      }
      if (type) {
        filtered = filtered.filter((d) => d.type === type)
      }

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
    url: '/api/operation/devices/:id',
    delay: 200,
    body({ params }) {
      const device = allDevices.find((d) => d.id === params.id)
      if (!device) {
        return { code: 404, message: '设备不存在', data: null }
      }
      return {
        code: 0,
        message: 'ok',
        data: {
          ...device,
          runningParams: {
            voltage: 380.5,
            current: 120.3,
            power: 45.6,
            temperature: 35.2,
            soc: device.type === 'BMS' ? 85.6 : undefined,
            soh: device.type === 'BMS' ? 97.8 : undefined,
          },
          historyData: {
            timestamps: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            power: [20, 35, 50, 45, 60, 40],
            temperature: [28, 30, 35, 38, 36, 32],
          },
          maintenanceRecords: [
            { id: 'm1', date: '2025-01-10', type: '例行巡检', operator: '张三', result: '正常' },
            { id: 'm2', date: '2024-12-15', type: '故障维修', operator: '李四', result: '已修复' },
          ],
        },
      }
    },
  },
  {
    url: '/api/operation/alarms',
    delay: 200,
    body({ query }) {
      const page = Number(query.current) || 1
      const pageSize = Number(query.pageSize) || 10
      const level = (query.level as string) || ''
      const status = (query.status as string) || ''

      let filtered = allAlarms
      if (level) filtered = filtered.filter((a) => a.level === level)
      if (status) filtered = filtered.filter((a) => a.status === status)

      const start = (page - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)

      return {
        code: 0,
        message: 'ok',
        data: { list, total: filtered.length },
      }
    },
  },
])
