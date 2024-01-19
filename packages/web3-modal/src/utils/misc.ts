import { ConnectorEnhanced, ConnectorEnhancedExtras, ConnectorOverrides } from '../types'

export function trimAndLowerCase(thing: string | undefined) {
  if (!thing) return ''

  return thing.replace(' ', '').toLowerCase()
}

export function connectorOverridePropSelector(
  overrides?: ConnectorOverrides,
  connectorOrPossibleIds?: ConnectorEnhanced | string[]
): ConnectorEnhancedExtras | undefined {
  const connectorIsArray = Array.isArray(connectorOrPossibleIds)
  if (!overrides || (connectorIsArray && !connectorOrPossibleIds?.length) || !connectorOrPossibleIds) return undefined
  else if (connectorIsArray) {
    const key = connectorOrPossibleIds.find((k) => overrides[trimAndLowerCase(k)])
    return overrides?.[trimAndLowerCase(key) ?? '']
  } else {
    return (
      overrides?.[trimAndLowerCase(connectorOrPossibleIds?.id)] ||
      overrides?.[trimAndLowerCase(connectorOrPossibleIds?.name)]
    )
  }
}
