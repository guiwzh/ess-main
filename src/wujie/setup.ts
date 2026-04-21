import type { RouteItem } from '@/services/generated/essApi'
import WujieReact from 'wujie-react'

const { setupApp, preloadApp } = WujieReact

/** 从动态路由中提取去重的子应用配置；检测到同名但配置不一致时打印警告 */
function extractSubApps(routes: RouteItem[]) {
  const map = new Map<string, { name: string; url: string; alive: boolean }>()
  function walk(items: RouteItem[]) {
    for (const r of items) {
      if (r.subApp) {
        const next = {
          name: r.subApp.name,
          url: r.subApp.url,
          alive: r.subApp.alive ?? false,
        }
        const existing = map.get(next.name)
        if (!existing) {
          map.set(next.name, next)
        } else if (existing.url !== next.url || existing.alive !== next.alive) {
          console.warn(
            `[wujie] subApp "${next.name}" has conflicting config: ` +
              `kept { url=${existing.url}, alive=${existing.alive} }, ` +
              `discarded { url=${next.url}, alive=${next.alive} }`,
          )
        }
      }
      if (r.children?.length) walk(r.children)
    }
  }
  walk(routes)
  return [...map.values()]
}

/**
 * 根据动态路由数据注册子应用配置并预加载资源
 * - setupApp: 注册默认属性，startApp 自动继承（name/alive 必须一致）
 * - preloadApp: 空闲时预加载子应用静态资源到内存
 */
export function initWujiePreload(routes: RouteItem[]) {
  const subApps = extractSubApps(routes)

  for (const app of subApps) {
    setupApp({
      name: app.name,
      url: app.url,
      alive: app.alive,
      fiber: true,
    })
  }

  const preloadAll = () => {
    for (const app of subApps) {
      preloadApp({ name: app.name, url: app.url })
    }
  }

  // 优先用 requestIdleCallback；Safari < 16.4 等无此 API 的环境回退到 setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadAll, { timeout: 3000 })
  } else {
    setTimeout(preloadAll, 2000)
  }
}
