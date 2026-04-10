import { useTranslation } from 'react-i18next'

const Dashboard: React.FC = () => {
  const { t } = useTranslation('menu')

  return (
    <div>
      <h2>{t('dashboard')}</h2>
      <p>Dashboard placeholder</p>
    </div>
  )
}

export default Dashboard
export const Component = Dashboard
