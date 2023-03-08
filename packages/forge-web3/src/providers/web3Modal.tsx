import { MobileWallet } from '@web3modal/core'
import { Chain, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'

// Annoying ass web3modal didnt export the type so...
interface ConfigCtrlState {
  projectId: string
  walletConnectVersion?: 1 | 2
  themeMode?: 'dark' | 'light'
  themeColor?: 'blackWhite' | 'blue' | 'default' | 'green' | 'magenta' | 'orange' | 'purple' | 'teal'
  themeBackground?: 'gradient' | 'themeColor'
  themeZIndex?: number
  standaloneChains?: string[]
  defaultChain?: Chain
  mobileWallets?: MobileWallet[]
  desktopWallets?: (MobileWallet & { links: { native: string; universal: string } })[]
  walletImages?: Record<string, string>
  chainImages?: Record<string, string>
  tokenImages?: Record<string, string>
  enableStandaloneMode?: boolean
  enableNetworkView?: boolean
  enableAccountView?: boolean
  explorerAllowList?: string[]
  explorerDenyList?: string[]
  termsOfServiceUrl?: string
  privacyPolicyUrl?: string
}
export type Web3ModalConfig = Omit<
  ConfigCtrlState,
  'enableStandaloneMode' | 'standaloneChains' | 'walletConnectVersion'
> & {
  chains: Chain[]
}

export interface WalletConnectProps {
  appName: string
  walletConnect: Web3ModalConfig
}

// Web3Modal Ethereum Client
export const createWagmiClient = (props: WalletConnectProps) =>
  createClient({
    autoConnect: true,
    connectors: modalConnectors({
      projectId: props.walletConnect.projectId,
      version: '2',
      appName: props.appName,
      chains: props.walletConnect.chains
    }),
    provider: configureChains(props.walletConnect.chains, [
      walletConnectProvider({ projectId: props.walletConnect.projectId })
    ]).provider
  })
