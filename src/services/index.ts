import { getESSMainAPI } from './generated/essApi'

export const { login, getUserInfo, getUserRoutes, getUserStations } = getESSMainAPI()

export type {
  LoginData,
  LoginParams,
  RouteItem,
  RouteMeta,
  Station,
  SubAppConfig,
  UserInfo,
} from './generated/essApi'
