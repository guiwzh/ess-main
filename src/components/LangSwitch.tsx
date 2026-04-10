import { Select } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/appStore'
import type { Locale } from '@/store/appStore'

const LangSwitch: React.FC = () => {
  const { i18n } = useTranslation()
  const { locale, setLocale } = useAppStore()

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
