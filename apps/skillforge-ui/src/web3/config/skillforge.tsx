import { connectors, frameConnectors } from '../connectors'
import { SUPPORTED_CHAINS_DEV, SUPPORTED_CHAINS_PROD } from './chains'
import { ForgeChainsMinimum, Web3ModalConfigWeb3Props } from '@past3lle/forge-web3'
import GOOGLE_APPLE_LOGO from 'assets/png/google-apple.png'
import { pstlModalTheme as PSTL_MODAL_THEME } from 'theme/pstlModal'
import { skillforgeTheme as SKILLFORGE_THEME } from 'theme/skillforge'
import { http } from 'viem'

const WCM_THEME_VARIABLES = {
  '--wcm-background-color': SKILLFORGE_THEME.blackOpaque,
  '--wcm-accent-color': '#525291',
  '--wcm-accent-fill-color': SKILLFORGE_THEME.modes.DEFAULT.mainBgAlt,
  // TODO: either host image on IK and call using params to set height/width
  // TODO: OR just save a formatted image W x H somewhere here
  '--wcm-overlay-background-color': SKILLFORGE_THEME.blackOpaque
  // '--wcm-background-image-url': 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-background.png?tr=h-103,w-0.99',
  // '--wcm-color-fg-1': SKILLFORGE_THEME.offwhiteOpaqueMore
}
const W3M_THEME_VARIABLES: Web3ModalConfigWeb3Props<
  typeof SUPPORTED_CHAINS_PROD
>['modals']['walletConnect']['themeVariables'] = {
  '--wcm-color-bg-1': SKILLFORGE_THEME.blackOpaque,
  '--w3m-accent': '#525291',
  '--wcm-color-bg-2': SKILLFORGE_THEME.modes.DEFAULT.mainBgAlt,
  // TODO: either host image on IK and call using params to set height/width
  // TODO: OR just save a formatted image W x H somewhere here
  '--wcm-color-bg-3': SKILLFORGE_THEME.blackOpaque,
  '--wcm-color-fg-1': SKILLFORGE_THEME.offwhiteOpaqueMore
  // '--wcm-background-image-url': 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-background.png?tr=h-103,w-0.99',
}


if (
  !process.env.REACT_APP_WEB3MODAL_ID ||
  !process.env.REACT_APP_WEB3AUTH_ID ||
  !process.env.REACT_APP_WEB3_AUTH_NETWORK
) {
  throw new Error('Missing W3A and/or W3M projectID env variables!')
}

export const SKILLFORGE_APP_NAME = 'SKILLFORGE'
export const WEB3_PROPS_BASE = {
  clients: {
    wagmi: {
      options: {
        // GOERLI KEY - steal it idgaf
        transports: {
          5: http(process.env.REACT_APP_ALCHEMY_GOERLI_API_KEY as string),
          137: http(process.env.REACT_APP_ALCHEMY_MATIC_API_KEY as string),
          80001: http(process.env.REACT_APP_ALCHEMY_MATIC_API_KEY as string)
        }
      }
    }
  },
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
        rank: 100,
        modalNodeId: 'w3m-modal'
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
      return decodedSearchParam ? chains.find((chain) => chain.name === decodedSearchParam.toLowerCase()) : undefined
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
      themeVariables: W3M_THEME_VARIABLES
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
} as const satisfies Omit<Web3ModalConfigWeb3Props<ForgeChainsMinimum>, 'chains'>

export const WEB3_PROPS_PRODUCTION = {
  ...WEB3_PROPS_BASE,
  chains: SUPPORTED_CHAINS_PROD
} as const satisfies Web3ModalConfigWeb3Props<typeof SUPPORTED_CHAINS_PROD>

export const WEB3_PROPS_DEVELOP = {
  ...WEB3_PROPS_BASE,
  chains: SUPPORTED_CHAINS_DEV
} as const

