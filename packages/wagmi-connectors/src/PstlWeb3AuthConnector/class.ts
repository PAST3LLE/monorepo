import { BaseAdapter } from '@web3auth/base'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { ConnectorData } from 'wagmi'

type AuxWeb3AuthConnectorParams<BA extends BaseAdapter<any>> = ConstructorParameters<typeof Web3AuthConnector>[0] & {
  options: ConstructorParameters<typeof Web3AuthConnector>[0]['options'] & { adapter?: BA }
}

export class AuxWeb3AuthConnector<BA extends BaseAdapter<any>> extends Web3AuthConnector {
  protected adapter: BA | undefined

  constructor(params: AuxWeb3AuthConnectorParams<BA>) {
    super(params)
    this.adapter = params?.options?.adapter
  }

  // Enhance super connect and listen to changes on adapter
  async connect({ chainId }: { chainId?: number } = {}): Promise<Required<ConnectorData>> {
    try {
      const data = await super.connect({ chainId })
      // Listen to emitted events
      this.adapter?.provider?.on('accountsChanged', this.onAccountsChanged)
      this.adapter?.provider?.on('chainChanged', this.onChainChanged)

      return data
    } catch (error) {
      // Stop listening to emitted events
      this.disconnectListeners()
      throw error
    }
  }

  async disconnect(): Promise<void> {
    this.disconnectListeners()
    super.disconnect()
  }

  private disconnectListeners() {
    this.adapter?.provider?.off('accountsChanged', this.onAccountsChanged)
    this.adapter?.provider?.off('chainChanged', this.onChainChanged)
  }
}
