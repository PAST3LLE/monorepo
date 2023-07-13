import { SmartAutoConnectProps, useSmartAutoConnect } from '../../hooks/useSmartAutoConnect'

export function SmartConnect(props: SmartAutoConnectProps) {
  // Run auto connection logic e.g safe app or iframe, we auto connect
  useSmartAutoConnect(props)

  return null
}
