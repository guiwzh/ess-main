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

  // 将完整路径拼到子应用 URL 上，子应用通过 basename 识别前缀
  const subUrl = useMemo(() => {
    if (!config) return ''
    return config.url + location.pathname + location.search
  }, [config, location.pathname, location.search])

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
