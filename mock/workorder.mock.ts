import { defineMock } from 'vite-plugin-mock-dev-server'

const allWorkOrders = [
  {
    id: 'WO-001',
    title: 'PCS-001 过温故障处理',
    type: 'fault',
    priority: 'high',
    status: 'pending',
    deviceCode: 'PCS-001',
    station: '储能站点A',
    assignee: '张三',
    createdAt: '2025-01-15 11:00:00',
  },
  {
    id: 'WO-002',
    title: 'BMS-001 通信恢复',
    type: 'fault',
    priority: 'medium',
    status: 'processing',
    deviceCode: 'BMS-001',
    station: '储能站点A',
    assignee: '李四',
    createdAt: '2025-01-14 09:30:00',
  },
  {
    id: 'WO-003',
    title: '储能站点B 月度巡检',
    type: 'inspection',
    priority: 'low',
    status: 'completed',
    deviceCode: '-',
    station: '储能站点B',
    assignee: '王五',
    createdAt: '2025-01-10 08:00:00',
  },
  {
    id: 'WO-004',
    title: 'HVAC-001 滤网更换',
    type: 'maintenance',
    priority: 'low',
    status: 'completed',
    deviceCode: 'HVAC-001',
    station: '储能站点B',
    assignee: '赵六',
    createdAt: '2025-01-08 14:00:00',
  },
  {
    id: 'WO-005',
    title: '变压器年度维保',
    type: 'maintenance',
    priority: 'medium',
    status: 'closed',
    deviceCode: 'TRANS-001',
    station: '储能站点A',
    assignee: '张三',
    createdAt: '2025-01-05 10:00:00',
  },
]

const staffList = [
  { id: 's1', name: '张三', role: '运维工程师' },
  { id: 's2', name: '李四', role: '运维工程师' },
  { id: 's3', name: '王五', role: '巡检员' },
  { id: 's4', name: '赵六', role: '维修技师' },
]

const inspectionTemplates = [
  {
    id: 't1',
    name: '日常巡检模板',
    items: ['外观检查', '温度检测', '电压检测', '接地检查'],
    frequency: 'daily',
    enabled: true,
  },
  {
    id: 't2',
    name: '月度巡检模板',
    items: ['绝缘测试', '接线端子紧固', '滤网清洁', '消防设备检查', '电池SOH评估'],
    frequency: 'monthly',
    enabled: true,
  },
  {
    id: 't3',
    name: '年度维保模板',
    items: ['全面性能测试', '电池容量标定', '变压器油检', '控制系统升级'],
    frequency: 'yearly',
    enabled: false,
  },
]

export default defineMock([
  {
    url: '/api/operation/work-orders',
    delay: 200,
    body({ query }) {
      const page = Number(query.current) || 1
      const pageSize = Number(query.pageSize) || 10
      const status = (query.status as string) || ''
      const type = (query.type as string) || ''

      let filtered = allWorkOrders
      if (status) filtered = filtered.filter((w) => w.status === status)
      if (type) filtered = filtered.filter((w) => w.type === type)

      const start = (page - 1) * pageSize
      return {
        code: 0,
        message: 'ok',
        data: { list: filtered.slice(start, start + pageSize), total: filtered.length },
      }
    },
  },
  {
    url: '/api/operation/work-orders',
    method: 'POST',
    delay: 500,
    body: { code: 0, message: '创建成功', data: { id: 'WO-' + Date.now() } },
  },
  {
    url: '/api/operation/work-orders/:id',
    delay: 200,
    body({ params }) {
      const wo = allWorkOrders.find((w) => w.id === params.id)
      if (!wo) return { code: 404, message: '工单不存在', data: null }
      return {
        code: 0,
        message: 'ok',
        data: {
          ...wo,
          timeline: [
            { time: wo.createdAt, action: '创建工单', operator: 'admin', remark: '系统自动生成' },
            {
              time: '2025-01-15 12:00:00',
              action: '派发工单',
              operator: 'admin',
              remark: `指派给${wo.assignee}`,
            },
            ...(wo.status !== 'pending'
              ? [
                  {
                    time: '2025-01-15 14:00:00',
                    action: '开始处理',
                    operator: wo.assignee,
                    remark: '已到达现场',
                  },
                ]
              : []),
            ...(wo.status === 'completed' || wo.status === 'closed'
              ? [
                  {
                    time: '2025-01-15 17:00:00',
                    action: '处理完成',
                    operator: wo.assignee,
                    remark: '故障已排除',
                  },
                ]
              : []),
          ],
        },
      }
    },
  },
  {
    url: '/api/operation/staff',
    delay: 100,
    body: { code: 0, message: 'ok', data: staffList },
  },
  {
    url: '/api/operation/inspection-templates',
    delay: 200,
    body: { code: 0, message: 'ok', data: inspectionTemplates },
  },
  {
    url: '/api/operation/inspection-templates',
    method: 'POST',
    delay: 300,
    body: { code: 0, message: '创建成功', data: { id: 't' + Date.now() } },
  },
  {
    url: '/api/operation/inspection-templates/:id',
    method: 'PUT',
    delay: 300,
    body: { code: 0, message: '更新成功', data: null },
  },
  {
    url: '/api/operation/inspection-templates/:id',
    method: 'DELETE',
    delay: 300,
    body: { code: 0, message: '删除成功', data: null },
  },
])
