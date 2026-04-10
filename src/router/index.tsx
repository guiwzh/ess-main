import { createBrowserRouter } from 'react-router-dom'
import BlankLayout from '@/layouts/BlankLayout'
import LoginPage from '@/pages/Login'
import AppEntry from './AppEntry'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <BlankLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/*',
    element: <AppEntry />,
  },
])

export default router
