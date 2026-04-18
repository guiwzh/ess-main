import { STORAGE_KEYS } from '@/constants'
import { clearTokens, setTokens } from '@/utils/auth'
import { create } from 'zustand'

export interface Station {
  id: string
  name: string
}

export interface UserInfo {
  id: string
  username: string
  realName: string
  avatar?: string
  roles: string[]
}

export interface RouteItem {
  path: string
  name: string
  icon?: string
  component?: string
  children?: RouteItem[]
  meta?: {
    title: string
    hideInMenu?: boolean
    permissions?: string[]
  }
}

export interface SubAppConfig {
  /** 子应用唯一名称 */
  name: string
  /** 子应用入口 URL（后端按环境返回） */
  url: string
  /** 是否使用 alive 模式（保活） */
  alive: boolean
}

interface UserState {
  token: string | null
  refreshToken: string | null
  userInfo: UserInfo | null
  permissions: string[]
  dynamicRoutes: RouteItem[]
  authorizedStations: Station[]
  subAppConfigs: SubAppConfig[]
}

interface UserActions {
  setAuth: (token: string, refreshToken: string) => void
  setUserInfo: (info: UserInfo) => void
  setPermissions: (permissions: string[]) => void
  setDynamicRoutes: (routes: RouteItem[]) => void
  setAuthorizedStations: (stations: Station[]) => void
  setSubAppConfigs: (configs: SubAppConfig[]) => void
  logout: () => void
}

const initialState: UserState = {
  token: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  userInfo: null,
  permissions: [],
  dynamicRoutes: [],
  authorizedStations: [],
  subAppConfigs: [],
}

export const useUserStore = create<UserState & UserActions>()((set) => ({
  ...initialState,

  setAuth: (token, refreshToken) => {
    setTokens(token, refreshToken)
    set({ token, refreshToken })
  },

  setUserInfo: (info) => {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(info))
    set({ userInfo: info })
  },

  setPermissions: (permissions) => set({ permissions }),

  setDynamicRoutes: (routes) => set({ dynamicRoutes: routes }),

  setAuthorizedStations: (stations) => set({ authorizedStations: stations }),

  setSubAppConfigs: (configs) => set({ subAppConfigs: configs }),

  logout: () => {
    clearTokens()
    set({ ...initialState, token: null, refreshToken: null })
  },
}))
