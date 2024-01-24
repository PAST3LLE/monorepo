import { Config, Connector } from 'wagmi'
import { ConnectData } from 'wagmi/query'

import type { ModalCtrl, UserOptionsCtrl } from '../controllers'
import { Web3ModalsStore } from '../hooks'

export type ConfigStore = { ui: Web3ModalsStore }

export type ConnectFunction = (connector: ConnectorEnhanced) => Promise<ConnectData<Config>>
export type ConnectorEnhancedExtras = {
  /**
   * @name customName Optional. Custom display name.
   */
  customName?: string
  /**
   * @name logo
   * @deprecated Deprecated. Use "icon" prop instead. Logo will be removed in next major release.
   */
  logo?: string
  /**
   * @name icon - icon override
   */
  icon?: string
  details?: string
  /**
   * @name customConnect
   * @description - custom connect function to call in place of the default connect. Does not need to extend the default connect but should eventually call it!
   * @param modalsStore - all web3 modals store
   * @see {Web3ModalsStore}
   * @returns whatever it needs to return but should connect to the connector!
   */
  customConnect?: <C extends ConnectorEnhanced>(params: {
    modalsStore: typeof ModalCtrl
    userStore: typeof UserOptionsCtrl
    connector?: C
    wagmiConnect: ConnectFunction
  }) => unknown
  /**
   * @name modalNodeId Optional. String ID name of modal node. Used to show async loader on mount
   */
  modalNodeId?: string
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
export type ConnectorEnhanced = Connector & ConnectorEnhancedExtras
/**
 * @name ConnectorOverrides
 * @description Key/Value pair overriding connector info. Displays in root modal. See {@link ConnectorEnhancedExtras}
 */
export type ConnectorOverrides = { [id: string]: ConnectorEnhancedExtras | undefined }
