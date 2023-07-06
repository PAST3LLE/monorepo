import { WindowProvider } from '@wagmi/connectors'

declare global {
  interface Window {
    ethereum?: WindowProvider & {
      providers?: WindowProvider[]
      providerMap?: Map<string, WindowProvider>
    }
    tally?: WindowProvider
    coinbaseWalletExtension?: WindowProvider
  }
}