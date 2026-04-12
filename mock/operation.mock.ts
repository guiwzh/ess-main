import { defineMock } from 'vite-plugin-mock-dev-server'

/**
 * 运维管理子应用 API Mock（wujie 模式统一拦截）
 * 与 sub-operation/mock/operation.mock.ts 保持同步
 */
export default defineMock([
  {
    url: '/api/operation/devices',
    delay: 200,
    body: {
      code: 0,
      message: 'ok',
      data: {
        list: [
          { id: '1', name: 'PCS-001', type: 'PCS', status: 'running', station: '储能站点A' },
          { id: '2', name: 'BMS-001', type: 'BMS', status: 'offline', station: '储能站点A' },
          { id: '3', name: 'PCS-002', type: 'PCS', status: 'running', station: '储能站点B' },
          { id: '4', name: 'HVAC-001', type: 'HVAC', status: 'standby', station: '储能站点B' },
          { id: '5', name: 'FIRE-001', type: 'FIRE', status: 'running', station: '储能站点C' },
        ],
        total: 5,
      },
    },
  },
  {
    url: '/api/operation/alarms',
    delay: 200,
    body: {
      code: 0,
      message: 'ok',
      data: {
        list: [
          {
            id: '1',
            message: 'PCS-001 过温告警',
            level: 'critical',
            time: '2025-01-15 10:30:00',
            status: 'active',
          },
          {
            id: '2',
            message: 'BMS-001 通信中断',
            level: 'warning',
            time: '2025-01-15 10:25:00',
            status: 'active',
          },
          {
            id: '3',
            message: '系统巡检完成',
            level: 'info',
            time: '2025-01-15 10:00:00',
            status: 'resolved',
          },
          {
            id: '4',
            message: 'HVAC-001 运行异常',
            level: 'warning',
            time: '2025-01-15 09:45:00',
            status: 'active',
          },
        ],
        total: 4,
      },
    },
  },
])
