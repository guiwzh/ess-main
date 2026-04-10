import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './styles/global.less'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<div>Loading...</div>}>
    <App />
  </Suspense>,
)
