import { devDebug } from '@past3lle/utils'
import { ConnectorNotFoundError } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'

import { ConnectorOverrides } from '../types'

export const WALLET_IMAGES = {
  web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
  safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
}

export const DEFAULT_CONNECTOR_OVERRIDES: ConnectorOverrides = {
  walletconnect: {
    customConnect: async ({ connector, userOptionsStore, wagmiConnect }) => {
      let unsubModalState: (() => void) | undefined = undefined
      try {
        if (!!connector) {
          const wcConnector = connector as unknown as ReturnType<ReturnType<typeof walletConnect>>
          const provider = await wcConnector.getProvider()

          unsubModalState = provider.modal?.subscribeModal?.((state: any) => {
            userOptionsStore.ux.bypassScrollLock = !!state.open
          })

          return wagmiConnect({ connector })
        }
        throw new ConnectorNotFoundError()
      } catch (error) {
        devDebug('[@past3ll3/web3-modal] Connector not found. Error:', error)
        unsubModalState?.()
        throw error
      }
    }
  }
}
