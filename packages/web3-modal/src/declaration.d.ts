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

declare module 'valtio' {
  function useSnapshot<T extends object>(p: T): T
}

declare module '*.png' {
  export const src: string
  export default src
}
