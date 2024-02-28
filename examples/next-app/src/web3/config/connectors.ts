import { injected } from 'wagmi/connectors'

export const CONNECTORS_CONFIG = [
  injected({
    shimDisconnect: true,
    target: {
      name: 'MetaMask',
      id: 'metamask',
      provider(window) {
        if (typeof window === 'undefined') return undefined
        return (
          (window as any)?.ethereum?.providerMap?.get('MetaMask') || (window.ethereum?.isMetaMask && window?.ethereum)
        )
      }
    }
  }),
  injected({
    shimDisconnect: true,
    target: {
      name: 'CoinbaseWallet',
      id: 'coinbaseWallet',
      provider(window) {
        if (typeof window === 'undefined') return undefined
        return window?.coinbaseWalletExtension
      }
    }
  }),
  injected({
    shimDisconnect: true,
    target: {
      name: 'Taho',
      id: 'taho',
      provider(window) {
        if (typeof window === 'undefined') return undefined
        return (window as any)?.tally
      }
    }
  })
]
