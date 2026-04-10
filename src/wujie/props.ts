import { useUserStore } from '@/store/userStore'
import { useAppStore } from '@/store/appStore'
import { getAccessToken } from '@/utils/auth'

/** 获取传递给子应用的 props */
export function getSubAppProps() {
  const userState = useUserStore.getState()
  const appState = useAppStore.getState()

  return {
    token: getAccessToken(),
    userInfo: userState.userInfo,
    permissions: userState.permissions,
    theme: appState.theme,
    locale: appState.locale,
    currentStation: appState.currentStation,
  }
}
