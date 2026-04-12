import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import WujieReact from 'wujie-react'
import { Spin, Result, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { getSubAppConfig } from './config'
import { useSubAppProps } from './props'
import { emitRouteChange } from './bus'

interface SubAppProps {
  /** 子应用名称，必须与 config 中注册的 name 一致 */
  name: string
}

/** 子应用加载超时时间 (ms) */
const LOAD_TIMEOUT = 15000

/** 已成功加载过的子应用（alive 模式下不再重复 loading） */
const loadedApps = new Set<string>()

export default function SubApp({ name }: SubAppProps) {
  const { t } = useTranslation('common')
  const alreadyLoaded = loadedApps.has(name)
  const [loading, setLoading] = useState(!alreadyLoaded)
  const [error, setError] = useState<string | null>(null)
  const config = getSubAppConfig(name)
  const subAppProps = useSubAppProps()
  const location = useLocation()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (alreadyLoaded) return
    timerRef.current = setTimeout(() => {
      setLoading(false)
      setError(t('subAppTimeout', { name }))
    }, LOAD_TIMEOUT)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [name, t, alreadyLoaded])

  // 提取子应用内部路径
  const subPath = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    return segments.length >= 2 ? '/' + segments.slice(1).join('/') : '/dashboard'
  }, [location.pathname])

  // 主应用路由变化时，通知子应用导航到对应路径
  useEffect(() => {
    emitRouteChange(subPath)
  }, [subPath])

  if (!config) {
    return <Result status="error" title={t('subAppNotFound')} subTitle={`${name}`} />
  }

  const handleLoadError = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setLoading(false)
    setError(t('subAppLoadError', { name }))
  }

  const handleLoading = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    loadedApps.add(name)
    setLoading(false)
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
    <Spin spinning={loading} tip={t('subAppLoading')} style={{ minHeight: 300 }}>
      <WujieReact
        name={config.name}
        url={config.url}
        alive={config.alive}
        props={{ ...subAppProps, initialPath: subPath } as unknown as Record<string, unknown>}
        loadError={handleLoadError}
        beforeLoad={() => handleLoading()}
      />
    </Spin>
  )
}
