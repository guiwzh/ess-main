import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, speed: 300 })

/** 路由切换时显示顶部进度条 */
const RouteProgress: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    NProgress.start()
    // Suspense 懒加载完成后，组件已渲染，此时 done
    const timer = setTimeout(() => NProgress.done(), 100)
    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [location.pathname])

  return null
}

export default RouteProgress
