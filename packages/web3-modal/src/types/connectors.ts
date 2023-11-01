import { ReactNode } from 'react'
import { useConnect } from 'wagmi'
import { Connector } from 'wagmi/connectors'

import { ModalPropsCtrl } from '../controllers/ModalPropsCtrl'
import { AllWeb3ModalStore } from '../hooks'

export type FullWeb3ModalStore = { ui: AllWeb3ModalStore; updateModalConfig: (typeof ModalPropsCtrl)['update'] }

type InfoTextMap = { title: ReactNode; content: ReactNode }
export type ConnectorEnhancedExtras = {
  /**
   * @name customName Optional. Custom display name.
   */
  customName?: string
  logo?: string
  details?: string
  /**
   * @name customConnect
   * @description - custom connect function to call in place of the default connect. Does not need to extend the default connect but should eventually call it!
   * @param modalsStore - all web3 modals store
   * @see {AllWeb3ModalStore}
   * @returns whatever it needs to return but should connect to the connector!
   */
  customConnect?: <C extends ConnectorEnhanced<any, any>>(params: {
    store: FullWeb3ModalStore
    connector?: C
    wagmiConnect: ReturnType<typeof useConnect>['connectAsync']
  }) => unknown
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
export interface ConnectorEnhanced<P, O> extends Connector<P, O>, ConnectorEnhancedExtras {}
/**
 * @name ConnectorOverrides
 * @description Key/Value pair overriding connector info. Displays in root modal. See {@link ConnectorEnhancedExtras}
 */
export type ConnectorOverrides = { [id: string]: ConnectorEnhancedExtras | undefined }
