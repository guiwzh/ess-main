import { Space, Dropdown, Switch, Select } from 'antd'
import { GlobalOutlined, UserOutlined, BulbOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'

const RightContent: React.FC = () => {
  const { i18n, t } = useTranslation('common')
  const navigate = useNavigate()
  const { theme, toggleTheme, locale, setLocale } = useAppStore()
  const { userInfo, logout } = useUserStore()

  const handleLocaleChange = (value: 'zh' | 'en') => {
    setLocale(value)
    i18n.changeLanguage(value)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Space size="middle">
      {/* 主题切换 */}
      <Switch
        checkedChildren={<BulbOutlined />}
        unCheckedChildren={<BulbOutlined />}
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />

      {/* 语言切换 */}
      <Select
        value={locale}
        onChange={handleLocaleChange}
        variant="borderless"
        suffixIcon={<GlobalOutlined />}
        options={[
          { value: 'zh', label: '中文' },
          { value: 'en', label: 'English' },
        ]}
        style={{ width: 100 }}
      />

      {/* 用户信息下拉 */}
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
