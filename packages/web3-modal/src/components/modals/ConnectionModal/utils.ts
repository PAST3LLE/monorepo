import { DEFAULT_CONNECTOR_OVERRIDES } from '../../../constants'
import { ConnectorEnhanced, ConnectorOverrides } from '../../../types'
import { connectorOverridePropSelector, trimAndLowerCase } from '../../../utils/misc'

export const sortConnectorsByRank =
  (overrides?: ConnectorOverrides) => (connA: ConnectorEnhanced, connB: ConnectorEnhanced) => {
    const connA_rank = connectorOverridePropSelector(overrides, connA)?.rank || 0
    const connB_rank = connectorOverridePropSelector(overrides, connB)?.rank || 0

    return connB_rank - connA_rank
  }

export function cleanAndFormatConnectorOverrides(overrides: ConnectorOverrides | undefined) {
  if (!overrides) return undefined
  return Object.entries(overrides).reduce((acc, [key, value]) => {
    const formattedKey = trimAndLowerCase(key)
    if (formattedKey) {
      acc[formattedKey] = {
        ...DEFAULT_CONNECTOR_OVERRIDES[formattedKey],
        ...value
      }
    }
    return acc
  }, {} as ConnectorOverrides)
}
