import { connectors, frameConnectors } from '../connectors'
import { SUPPORTED_CHAINS } from './chains'
import { Web3ModalConfigWeb3Props } from '@past3lle/forge-web3'
import GOOGLE_APPLE_LOGO from 'assets/png/google-apple.png'
import { pstlModalTheme as PSTL_MODAL_THEME } from 'theme/pstlModal'
import { skillforgeTheme as SKILLFORGE_THEME } from 'theme/skillforge'

if (
  !process.env.REACT_APP_WEB3MODAL_ID ||
  !process.env.REACT_APP_WEB3AUTH_ID ||
  !process.env.REACT_APP_WEB3_AUTH_NETWORK
) {
  throw new Error('Missing W3A and/or W3M projectID env variables!')
}

export const SKILLFORGE_APP_NAME = 'SKILLFORGE'
export const WEB3_PROPS: Web3ModalConfigWeb3Props = {
  chains: SUPPORTED_CHAINS,
  connectors: {
    connectors,
    overrides: {
      web3auth: {
        isRecommended: true,
        logo: GOOGLE_APPLE_LOGO,
        customName: 'Google & more',
        rank: 1000
      },
      walletconnect: {
        logo: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Gradient/Logo.png',
        customName: 'Web3',
        rank: 100
      },
      'ledger-hid': {
        logo: 'https://crypto-central.io/library/uploads/Ledger-Logo-3.png',
        rank: 0
      }
    }
  },
  frameConnectors,
  callbacks: {
    switchChain: async (chains) => {
      if (typeof globalThis?.window == 'undefined') return undefined
      const searchParams = new URLSearchParams(window.location.search)
      const dirtyParams = searchParams.get('forge-network')

      const decodedSearchParam = dirtyParams ? decodeURI(dirtyParams) : undefined
      return decodedSearchParam ? chains.find((chain) => chain.network === decodedSearchParam.toLowerCase()) : undefined
    }
  },
  options: {
    pollingInterval: 10_000,
    autoConnect: false,
    closeModalOnKeys: ['Escape', 'Esc']
  },
  modals: {
    walletConnect: {
      projectId: process.env.REACT_APP_WEB3MODAL_ID as string,
      themeMode: 'dark',
      themeVariables: {
        '--w3m-background-color': SKILLFORGE_THEME.blackOpaque,
        '--w3m-accent-color': '#525291',
        '--w3m-accent-fill-color': SKILLFORGE_THEME.modes.DEFAULT.mainBgAlt,
        // TODO: either host image on IK and call using params to set height/width
        // TODO: OR just save a formatted image W x H somewhere here
        '--w3m-background-image-url': 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-background.png?tr=h-103,w-0.99',
        '--w3m-color-bg-1': SKILLFORGE_THEME.blackOpaque,
        '--w3m-color-fg-1': SKILLFORGE_THEME.offwhiteOpaqueMore
      }
    },
    root: {
      chainImages: {
        [1]: 'https://cryptologos.cc/logos/versions/ethereum-eth-logo-colored.svg',
        [5]: 'https://cryptologos.cc/logos/versions/ethereum-eth-logo-colored.svg',
        [137]:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Polygon_Blockchain_Matic_Logo.svg/1200px-Polygon_Blockchain_Matic_Logo.svg.png'
      },
      title: SKILLFORGE_APP_NAME + ' LOGIN',
      themeConfig: { theme: PSTL_MODAL_THEME },
      walletsView: 'list',
      maxHeight: '650px',
      maxWidth: '360px',
      margin: 'auto',
      closeModalOnConnect: true,
      hideInjectedFromRoot: true,
      loaderProps: {
        spinnerProps: { size: 85 },
        loadingText: 'GETTING LOGIN...'
      }
    }
  }
}
