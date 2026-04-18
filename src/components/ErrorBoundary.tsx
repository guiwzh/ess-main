import { Button, Result } from 'antd'
import i18n from 'i18next'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** 自定义 fallback 渲染 */
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset)
      }
      return (
        <Result
          status="error"
          title={i18n.t('common:pageError', { defaultValue: '页面出错了' })}
          subTitle={this.state.error.message}
          extra={
            <Button type="primary" onClick={this.handleReset}>
              {i18n.t('common:retry', { defaultValue: '重试' })}
            </Button>
          }
        />
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
