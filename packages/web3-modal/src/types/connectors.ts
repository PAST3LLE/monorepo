import { ReactNode } from 'react'
import { Connector } from 'wagmi'

type InfoTextMap = { title: ReactNode; content: ReactNode }
export type ConnectorEnhancedExtras = {
  /**
   * @name customName Optional. Custom display name.
   */
  customName?: string
  logo?: string
  details?: string
  /**
   * @name modalNodeId Optional. String ID name of modal node. Used to show async loader on mount
   */
  modalNodeId?: string
  /**
   * @name infoText Optional. Helper text to show under connector
   */
  infoText?: InfoTextMap
  /**
   * @name isRecommended Optional. Boolean flag to show recommended label
   */
  isRecommended?: boolean
  /**
   * @name rank Optional. Number rank. Higher the number, the higher in the modal connector appears
   */
  rank?: number
  /**
   * @name downloadUrl Optional. URL to navigate to in case provider does not exist
   */
  downloadUrl?: string
}
export type ConnectorEnhanced<P, O> = Connector<P, O> & ConnectorEnhancedExtras
/**
 * @name ConnectorOverrides
 * @description Key/Value pair overriding connector info. Displays in root modal. See {@link ConnectorEnhancedExtras}
 */
export type ConnectorOverrides = { [id: string]: ConnectorEnhancedExtras | undefined }
