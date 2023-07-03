import { ConnectorEnhanced, ConnectorOverrides } from '../../types'

export const sortConnectorsByRank =
  (connectorDisplayOverrides?: ConnectorOverrides) =>
  (connA: ConnectorEnhanced<any, any>, connB: ConnectorEnhanced<any, any>) => {
    const connA_rank = (connectorDisplayOverrides?.[connA.id] || connectorDisplayOverrides?.[connA.name])?.rank || 0
    const connB_rank = (connectorDisplayOverrides?.[connB.id] || connectorDisplayOverrides?.[connB.name])?.rank || 0

    return connB_rank - connA_rank
  }
