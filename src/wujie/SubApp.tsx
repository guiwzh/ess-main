import { useEffect, useMemo, useRef, useState } from 'react'
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

/** 子应用加载超时时间 (ms) */
const LOAD_TIMEOUT = 5000

export default function SubApp({ name }: SubAppProps) {
  const { t } = useTranslation('common')
  const [error, setError] = useState<string | null>(null)
  const config = getSubAppConfig(name)
  const subAppProps = useSubAppProps()
  const location = useLocation()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = false
    timerRef.current = setTimeout(() => {
      if (!mountedRef.current) {
        setError(t('subAppTimeout', { name }))
      }
    }, LOAD_TIMEOUT)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [name, t])

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

  const clearTimer = () => {
    mountedRef.current = true
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
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
      loadError={() => {
        clearTimer()
        setError(t('subAppLoadError', { name }))
      }}
      afterMount={clearTimer}
    />
  )
}
