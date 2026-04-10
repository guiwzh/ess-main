import { createBrowserRouter, Navigate } from 'react-router-dom'
import BlankLayout from '@/layouts/BlankLayout'
import BasicLayout from '@/layouts/BasicLayout'
import AuthGuard from './AuthGuard'
import LoginPage from '@/pages/Login'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <BlankLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <BasicLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        lazy: () => import('@/pages/Dashboard'),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router
