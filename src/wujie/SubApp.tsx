import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
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

  // 将子应用内部路径拼到 URL 上，单例模式下改变 url 即可同步路由
  const subUrl = useMemo(() => {
    if (!config) return ''
    const segments = location.pathname.split('/').filter(Boolean)
    const subPath = segments.length >= 2 ? '/' + segments.slice(1).join('/') : '/'
    return config.url + subPath
  }, [config, location.pathname])

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
      props={subAppProps as unknown as Record<string, unknown>}
      loadError={() => setError(t('subAppLoadError', { name }))}
    />
  )
}
