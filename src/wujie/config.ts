import { SUB_APP_URLS } from '@/constants'

export interface SubAppConfig {
  /** 子应用唯一名称 */
  name: string
  /** 子应用入口 URL */
  url: string
  /** 是否使用 alive 模式（保活） */
  alive: boolean
  /** 执行模式 */
  exec?: boolean
  /** 自定义 fetch */
  fetch?: typeof fetch
}

/** 子应用注册配置 */
export const subAppConfigs: SubAppConfig[] = [
  {
    name: 'sub-operation',
    url: SUB_APP_URLS.OPERATION,
    alive: false,
  },
  {
    name: 'sub-analysis',
    url: SUB_APP_URLS.ANALYSIS,
    alive: false,
  },
]

/** 根据名称获取子应用配置 */
export function getSubAppConfig(name: string): SubAppConfig | undefined {
  return subAppConfigs.find((app) => app.name === name)
}
