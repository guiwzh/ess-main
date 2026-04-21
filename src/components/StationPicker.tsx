import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { EnvironmentOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import { useEffect } from 'react'

const StationPicker: React.FC = () => {
  const currentStation = useAppStore((s) => s.currentStation)
  const setCurrentStation = useAppStore((s) => s.setCurrentStation)
  const authorizedStations = useUserStore((s) => s.authorizedStations)

  // 站点列表加载后，若尚未选择站点则自动选中第一个
  useEffect(() => {
    if (!currentStation && authorizedStations.length) {
      setCurrentStation(authorizedStations[0].id)
    }
  }, [currentStation, authorizedStations, setCurrentStation])

  if (!authorizedStations.length) return null

  return (
    <Select
      value={currentStation ?? authorizedStations[0]?.id}
      onChange={setCurrentStation}
      variant="borderless"
      suffixIcon={<EnvironmentOutlined />}
      options={authorizedStations.map((s) => ({ value: s.id, label: s.name }))}
      style={{ width: 140 }}
    />
  )
}

export default StationPicker
