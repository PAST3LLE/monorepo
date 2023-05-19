import { ReactNode } from 'react'
import { Connector } from 'wagmi'

type InfoTextMap = { title: ReactNode; content: ReactNode }
export type ConnectorEnhancedExtras = {
  customName?: string
  logo?: string
  details?: string
  infoText?: InfoTextMap
}
export type ConnectorEnhanced<P, O, S> = Connector<P, O, S> & ConnectorEnhancedExtras
