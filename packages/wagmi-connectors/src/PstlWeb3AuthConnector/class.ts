import { BaseAdapter } from '@web3auth/base'
import { IPlugin } from '@web3auth/base-plugin'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'

type AuxWeb3AuthConnectorParams<BA extends BaseAdapter<any>, PL extends IPlugin[]> = ConstructorParameters<
  typeof Web3AuthConnector
>[0] & {
  options: ConstructorParameters<typeof Web3AuthConnector>[0]['options'] & { adapter?: BA; plugins?: PL }
}

export class AuxWeb3AuthConnector<BA extends BaseAdapter<any>, PL extends IPlugin[]> extends Web3AuthConnector {
  protected adapter: BA | undefined
  protected plugins: PL | undefined

  constructor(params: AuxWeb3AuthConnectorParams<BA, PL>) {
    super(params)
    this.adapter = params?.options?.adapter
    this.plugins = params?.options?.plugins
  }

  // Enhance super connect and listen to changes on adapter
  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const data = await super.connect({ chainId })
      // Listen to emitted events FROM ADAPTER (current web3auth version ~7.x doesnt listen to this)
      // Which never prompts wagmi to update the connector
      // See issue: https://github.com/Web3Auth/web3auth-wagmi-connector/pull/113
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
