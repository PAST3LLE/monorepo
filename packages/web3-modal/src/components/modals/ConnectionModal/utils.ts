import { ConnectorEnhanced, ConnectorOverrides } from '../../../types'
import { trimAndLowerCase } from '../../../utils'

export const sortConnectorsByRank =
  (connectorDisplayOverrides?: ConnectorOverrides) =>
  (connA: ConnectorEnhanced<any, any>, connB: ConnectorEnhanced<any, any>) => {
    const connA_rank =
      (
        connectorDisplayOverrides?.[trimAndLowerCase(connA.id)] ||
        connectorDisplayOverrides?.[trimAndLowerCase(connA.name)]
      )?.rank || 0
    const connB_rank =
      (
        connectorDisplayOverrides?.[trimAndLowerCase(connB.id)] ||
        connectorDisplayOverrides?.[trimAndLowerCase(connB.name)]
      )?.rank || 0

    return connB_rank - connA_rank
  }

export function cleanAndFormatConnectorOverrides(overrides: ConnectorOverrides | undefined) {
  if (!overrides) return undefined
  return Object.entries(overrides).reduce((acc, [key, value]) => {
    const formattedKey = trimAndLowerCase(key)
    if (formattedKey) {
      acc[formattedKey] = value
    }
    return acc
  }, {} as ConnectorOverrides)
}
