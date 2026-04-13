declare module 'wujie-react' {
  import type { Component } from 'react'

  interface WujieReactProps {
    name: string
    url: string
    alive?: boolean
    exec?: boolean
    replace?: (code: string) => string
    fetch?: typeof window.fetch
    props?: Record<string, unknown>
    attrs?: Record<string, unknown>
    beforeLoad?: () => void
    beforeMount?: () => void
    afterMount?: () => void
    beforeUnmount?: () => void
    afterUnmount?: () => void
    activated?: () => void
    deactivated?: () => void
    loadError?: (url: string, e: Error) => void
    width?: string
    height?: string
  }

  interface EventBus {
    $on: (event: string, callback: (...args: unknown[]) => void) => EventBus
    $off: (event: string, callback: (...args: unknown[]) => void) => EventBus
    $emit: (event: string, ...args: unknown[]) => EventBus
  }

  class WujieReact extends Component<WujieReactProps> {
    static bus: EventBus
    static setupApp: (options: Record<string, unknown>) => void
    static preloadApp: (options: Record<string, unknown>) => void
    static destroyApp: (name: string) => void
  }

  export default WujieReact
}
