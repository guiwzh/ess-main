import type { AxiosRequestConfig } from 'axios'
import request from './request'

/**
 * orval 自定义 mutator — 桥接项目的 axios 实例与 orval 生成的请求代码。
 * orval 生成的每个 API 函数最终调用此函数发送请求。
 */
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return request(config).then((res) => res.data)
}
