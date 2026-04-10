import { Switch } from 'antd'
import { BulbOutlined } from '@ant-design/icons'
import { useAppStore } from '@/store/appStore'

const ThemeSwitch: React.FC = () => {
  const { theme, toggleTheme } = useAppStore()

  return (
    <Switch
      checkedChildren={<BulbOutlined />}
      unCheckedChildren={<BulbOutlined />}
      checked={theme === 'dark'}
      onChange={toggleTheme}
    />
  )
}

export default ThemeSwitch
