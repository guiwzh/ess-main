import { useUserStore, type SubAppConfig } from '@/store/userStore'

export type { SubAppConfig }

/** 根据名称获取子应用配置（从 store 动态读取，数据来源于后端接口） */
export function getSubAppConfig(name: string): SubAppConfig | undefined {
  return useUserStore.getState().subAppConfigs.find((app) => app.name === name)
}
