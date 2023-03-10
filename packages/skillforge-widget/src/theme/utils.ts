import { useTheme } from 'styled-components'

export function useAssetsMap() {
  return useTheme().assetsMap
}
