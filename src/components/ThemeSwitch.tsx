import { useAppStore } from '@/store/appStore'
import { BulbOutlined } from '@ant-design/icons'
import { Switch } from 'antd'

const ThemeSwitch: React.FC = () => {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

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
