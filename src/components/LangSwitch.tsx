import type { Locale } from '@/store/appStore'
import { useAppStore } from '@/store/appStore'
import { GlobalOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import { useTranslation } from 'react-i18next'

const LangSwitch: React.FC = () => {
  const { i18n } = useTranslation()
  const locale = useAppStore((s) => s.locale)
  const setLocale = useAppStore((s) => s.setLocale)

  const handleChange = (value: Locale) => {
    setLocale(value)
    i18n.changeLanguage(value)
  }

  return (
    <Select
      value={locale}
      onChange={handleChange}
      variant="borderless"
      suffixIcon={<GlobalOutlined />}
      options={[
        { value: 'zh', label: '中文' },
        { value: 'en', label: 'English' },
      ]}
      style={{ width: 100 }}
    />
  )
}

export default LangSwitch
