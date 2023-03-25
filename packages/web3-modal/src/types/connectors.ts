import { Connector } from 'wagmi'

export type ConnectorEnhanced<P, O, S> = Connector<P, O, S> & {
  customName?: string
  logo?: string
}
