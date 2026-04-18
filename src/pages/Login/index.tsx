import type { LoginParams } from '@/services/auth'
import { login } from '@/services/auth'
import { useUserStore } from '@/store/userStore'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, message } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('auth')
  const setAuth = useUserStore((s) => s.setAuth)
  const [form] = Form.useForm<LoginParams>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: LoginParams) => {
    setLoading(true)
    try {
      const { data: res } = await login(values)
      if (res.code === 0) {
        setAuth(res.data.accessToken, res.data.refreshToken)
        message.success(t('loginSuccess'))
        navigate('/', { replace: true })
      } else {
        message.error(res.message || t('loginFailed'))
      }
    } catch {
      message.error(t('loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('loginTitle')}</h1>
        <Form form={form} onFinish={handleSubmit} size="large" autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: t('usernameRequired') }]}>
            <Input prefix={<UserOutlined />} placeholder={t('usernamePlaceholder')} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: t('passwordRequired') }]}>
            <Input.Password prefix={<LockOutlined />} placeholder={t('passwordPlaceholder')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {t('loginButton')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
