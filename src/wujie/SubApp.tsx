import { Button, Result } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import WujieReact from 'wujie-react'
import { useSubAppProps } from './props'

interface SubAppProps {
  /** 子应用唯一名称 */
  name: string
  /** 子应用入口 URL */
  url: string
  /** 是否使用 alive 模式（保活） */
  alive?: boolean
}

const SubApp = ({ name, url, alive = false }: SubAppProps) => {
  const { t } = useTranslation('common')
  const [error, setError] = useState<string | null>(null)
  const subAppProps = useSubAppProps()
  const location = useLocation()

  // 将完整路径拼到子应用 URL 上，子应用通过 basename 识别前缀
  const subUrl = useMemo(() => {
    return url + location.pathname + location.search
  }, [url, location.pathname, location.search])

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
      name={name}
      url={subUrl}
      alive={alive}
      props={subAppProps as unknown as Record<string, unknown>}
      loadError={() => setError(t('subAppLoadError', { name }))}
    />
  )
}

export default SubApp
