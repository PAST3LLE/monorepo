import { ConnectorOverrides } from '../types'

export const WALLET_IMAGES = {
  web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
  safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
}

export const DEFAULT_CONNECTOR_OVERRIDES: ConnectorOverrides = {
  walletconnect: {
    customConnect: async ({ store }) => store.ui.walletConnect.open()
  }
}
