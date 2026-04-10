import { Select } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'

const StationPicker: React.FC = () => {
  const { currentStation, setCurrentStation } = useAppStore()
  const authorizedStations = useUserStore((s) => s.authorizedStations)

  if (!authorizedStations.length) return null

  return (
    <Select
      value={currentStation || authorizedStations[0]?.id}
      onChange={setCurrentStation}
      variant="borderless"
      suffixIcon={<EnvironmentOutlined />}
      options={authorizedStations.map((s) => ({ value: s.id, label: s.name }))}
      style={{ width: 140 }}
    />
  )
}

export default StationPicker
