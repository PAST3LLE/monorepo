import { Config, Connector, CreateConnectorFn, UseConnectReturnType } from 'wagmi'
import { ConnectData } from 'wagmi/query'

import { UserOptionsCtrlState } from '../controllers/types'
import { AllWeb3ModalStore } from '../hooks'

export type FullWeb3ModalStore = { ui: AllWeb3ModalStore }

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
  customConnect?: <C extends CreateConnectorFn | ConnectorEnhanced>(params: {
    store: FullWeb3ModalStore['ui']
    userOptionsStore: UserOptionsCtrlState
    connector?: C
    wagmiConnect: (
      params: Omit<Parameters<UseConnectReturnType['connectAsync']>[0], 'connector'> & {
        connector: CreateConnectorFn | ConnectorEnhanced
      }
    ) => Promise<ConnectData<Config>>
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
