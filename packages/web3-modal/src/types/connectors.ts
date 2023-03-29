import { Connector } from 'wagmi'

export type ConnectorEnhancedExtras = {
  customName?: string
  logo?: string
  details?: string
}
export type ConnectorEnhanced<P, O, S> = Connector<P, O, S> & ConnectorEnhancedExtras
