import { ReactNode } from 'react'
import { Connector } from 'wagmi'

type InfoTextMap = { title: ReactNode; content: ReactNode }
export type ConnectorEnhancedExtras = {
  customName?: string
  logo?: string
  details?: string
  infoText?: InfoTextMap
  isRecommended?: boolean
  rank?: number
}
export type ConnectorEnhanced<P, O> = Connector<P, O> & ConnectorEnhancedExtras
