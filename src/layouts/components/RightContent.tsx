import LangSwitch from '@/components/LangSwitch'
import StationPicker from '@/components/StationPicker'
import ThemeSwitch from '@/components/ThemeSwitch'
import { useUserStore } from '@/store/userStore'
import { UserOutlined } from '@ant-design/icons'
import { Dropdown, Skeleton, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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

      {userInfo ? (
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
            <span>{userInfo.realName || userInfo.username}</span>
          </Space>
        </Dropdown>
      ) : (
        <Skeleton.Input active size="small" style={{ width: 80 }} />
      )}
    </Space>
  )
}

export default RightContent
