import { useMemo, useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import WujieReact from 'wujie-react'
import { Result, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { getSubAppConfig } from './config'
import { useSubAppProps } from './props'

interface SubAppProps {
  /** 子应用名称，必须与 config 中注册的 name 一致 */
  name: string
}

export default function SubApp({ name }: SubAppProps) {
  const { t } = useTranslation('common')
  const [error, setError] = useState<string | null>(null)
  const config = getSubAppConfig(name)
  const subAppProps = useSubAppProps()
  const location = useLocation()
  const navigate = useNavigate()

  // 计算子应用在主应用中的路由前缀，如 /operation
  const basePath = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    return segments[0] ? '/' + segments[0] : '/'
  }, [location.pathname])

  // 注入给子应用的导航函数，子应用通过 $wujie.props.navigate 调用
  const jump = useCallback((path: string) => navigate(path), [navigate])

  // 将子应用内部路径拼到 URL 上，单例模式下改变 url 即可同步路由
  const subUrl = useMemo(() => {
    if (!config) return ''
    const segments = location.pathname.split('/').filter(Boolean)
    const subPath = segments.length >= 2 ? '/' + segments.slice(1).join('/') : '/'
    return config.url + subPath + location.search
  }, [config, location.pathname, location.search])

  const mergedProps = useMemo(
    () => ({ ...subAppProps, basePath, navigate: jump }),
    [subAppProps, basePath, jump],
  )

  if (!config) {
    return <Result status="error" title={t('subAppNotFound')} subTitle={`${name}`} />
  }

  if (error) {
    return (
      <Result
        status="error"
        title={t('subAppError')}
        subTitle={error}
        extra={
          <Button type="primary" onClick={() => window.location.reload()}>
            {t('retry')}
          </Button>
        }
      />
    )
  }

  return (
    <WujieReact
      name={config.name}
      url={subUrl}
      alive={config.alive}
      props={mergedProps as unknown as Record<string, unknown>}
      loadError={() => setError(t('subAppLoadError', { name }))}
    />
  )
}
