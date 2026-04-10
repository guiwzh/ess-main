import { Space, Dropdown } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import ThemeSwitch from '@/components/ThemeSwitch'
import LangSwitch from '@/components/LangSwitch'
import StationPicker from '@/components/StationPicker'

const RightContent: React.FC = () => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const { userInfo, logout } = useUserStore()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Space size="middle">
      <StationPicker />
      <ThemeSwitch />
      <LangSwitch />

      <Dropdown
        menu={{
          items: [{ key: 'logout', label: t('logout'), danger: true }],
          onClick: ({ key }) => {
            if (key === 'logout') handleLogout()
          },
        }}
      >
        <Space style={{ cursor: 'pointer' }}>
          <UserOutlined />
          <span>{userInfo?.realName || userInfo?.username || '-'}</span>
        </Space>
      </Dropdown>
    </Space>
  )
}

export default RightContent
