[]()

## Example implementation
Feel free to split the files how you'd like, but here's the way we do it in our own apps.

### 1: Create a `theme.ts` file
Create a new modal theme via the `createTheme` helper function:
```tsx
import { createTheme } from '@past3lle/web3-modal'

export const PALETTE = {
  mainBg: 'rgb(21, 142, 155)',
  mainBgOpaque: '#148f9cad',
  blackOpaque1: 'rgba(0, 0, 0, 0.88)',
  blackOpaque3: '#00000042',
  text: 'ghostwhite',
  textInverse: 'black'
}
const modalTheme = createTheme({
  DEFAULT: {
    modals: {
      connection: {
        backgroundImg: 'SOME_IMAGE_URL',
        title: {
          color: PALETTE.text
        },
        button: {
          backgroundColor: PALETTE.mainBgOpaque,
          fontWeight: 600,
          letterSpacing: '-1.7px',
          fontStyle: 'normal',
          textShadow: '3px 2px 2px #00000078'
        }
      }
    }
  }
})

export default modalTheme
```

### 2: Create a config.ts file
```tsx
import { PstlWeb3ModalProps } from '@past3lle/web3-modal'
import { mainnet } from '@wagmi/chains'
import modalTheme, { PALETTE } from 'theme'

import { LedgerConnector } from 'wagmi/connectors/ledger'

// Ranks wallet connectors on modal (higher number = higher in modal list)
enum WalletRank {
  'ledger' = 10,
  'walletConnect' = 2,
  'web3auth' = 1,
  'injected' = 0
}

// Z index for 
enum ZIndices {
  BASE = 500,
  W3M = 600,
  W3A = 700
}

// app accepted chains
const chains = [mainnet]
// Get these from cloud.walletconnect.com and dashboard.web3auth.io, respectively
const WALLETCONNECT_PROJECT_ID = 'WALLETCONNECT_PROJECT_ID'
const WEB3AUTH_PROJECT_ID = 'WEB3AUTH_PROJECT_ID'

const config = {
  appName: 'Test App',
  chains,
  wagmiClient: {
    options: {
      pollingInterval: 10_000,
      // add any custom connectors here
        connectors: [
            new LedgerConnector({ 
                chains, 
                options: { 
                    projectId: WALLETCONNECT_PROJECT_ID, 
                    walletConnectVersion: 2 
                } 
            })
        ]
    }
  },
  modals: { 
    pstl: {
      closeModalOnConnect: true,
      zIndex: ZIndices.BASE,
      title: 'TITLE HERE',
      themeConfig: {
        theme: modalTheme
      },
      hideInjectedFromRoot: true,
      connectorDisplayOverrides: {
        web3auth: {
          logo: 'https://www.pngkit.com/png/full/178-1783296_g-transparent-circle-google-logo.png',
          customName: 'GMAIL & MOBILE',
          // Uncomment to add helper text under connectors
          // infoText: {
          //   title: 'How does this option connect me to the blockchain?',
          //   content:
          //     'Choose this to ... etc etc'
          // },
          rank: WalletRank['web3auth']
        },
        walletConnect: {
          // Uncomment to add helper text under connectors
          // infoText: {
          //   title: 'What is this option?',
          //   content: 'Choose this to open the WalletConnect wallet modal and select a 3rd party wallet of your choice!'
          // },
          rank: WalletRank['walletConnect']
        },
        ledger: {
          logo:
            'https://play-lh.googleusercontent.com/mHjR3KaAMw3RGA15-t8gXNAy_Onr4ZYUQ07Z9fG2vd51IXO5rd7wtdqEWbNMPTgdqrk',
          customName: 'LEDGER LIVE',
          // Uncomment to add helper text under connectors
          // infoText: {
          //   title: 'What is this option?',
          //   content: 'Choose this to connect with your Ledger hardware wallet via the LedgerLive desktop app!'
          // },
          rank: WalletRank['ledger']
        }
      }
    },
    w3a: {
      appName: 'Test App',
      projectId: WEB3AUTH_PROJECT_ID,
      network: 'testnet',
      preset: 'DISALLOW_EXTERNAL_WALLETS'
    },
    w3m: {
      // test id, don't use in prod!
      projectId: WALLETCONNECT_PROJECT_ID,
      zIndex: 1000,
      themeMode: 'dark',
      themeVariables: {
        '--w3m-overlay-background-color': PALETTE.blackOpaque3,
        '--w3m-background-color': PALETTE.mainBg,
        '--w3m-background-image-url': 'SOME_OTHER_BACKGROUND_LOGO.png',
        '--w3m-accent-color': PALETTE.mainBg,
        '--w3m-color-bg-1': PALETTE.blackOpaque1
      }
    }
  }
} as PstlWeb3ModalProps<number>

export default config
```

### 3: Add to app somewhere (like `App.tsx`, for example)
```tsx
import PSTL_MODAL_CONFIG from './config'
import { PstlW3Providers, usePstlConnection } from '@past3lle/web3-modal'

export default function App() {
  return (
    <PstlW3Providers config={PSTL_MODAL_CONFIG}>
      <InnerApp />
    </PstlW3Providers>
  )
}
```

### Modal Props
```ts
// Required. App name registered to providers.
appName: string
// Required. App chains. Import them from "@wagmi/chains" or "wagmi/chains" or "viem"
chains: Chain[]
// Optional. Options for getting the chain info from URL.
// type: 'network' expects url schema: "someUrl.com/?network=goerli
// type: 'id' expects url schema: "someUrl.com/?id=5
chainFromUrlOptions?: { key: string; type: 'network' | 'id' }
wagmiClient?: {
    // Optional. Client is automatically created for you if left undefined here.
    // We recommend not passing a client here and letting the app create one for you.
    client?: WagmiClient
    // Optional. Wagmi creation options.
    options?: {
        // Optional. Array of publicClient objects in order of importance (lower index = higher importance)
        // Clients are normally created via Wagmi's configureChains function
        publicClients?: (typeof publicProvider)[]
        // Optional. Array of connectors to add. E.g LedgerConnector as shown in the example implementation.
        connectors?: Connector<any, any>[] // Default: undefined
        // Optional. Polling interval in milliseconds.
        pollingInterval?: number // Default: 4000 (4s)
        // Optional. Reconnects last connected provider on reload.
        autoConnect?: boolean // Default: false
    }
}
// Optional. Ethereum client.
// If blank, app handles creation of Ethereum client.
// We recommend not passing your own and letting the app handle this.
ethereumClient?: EthereumClient
modals: {
    pstl?: {
        // Optional. Modal title.
        title?: string // Default: "WALLET CONNECTION"
        // Optional. Base modal z-index value.
        zIndex?: number // Default: 999
        // Optional.
        themeConfig?: {
            // Optional. Modal theme; return value from constructing a modal theme via fn createTheme(...)
            theme: ReturnType<typeof createTheme>
            // Optional. Pass outer theme from upper level of surrounding app to sync theme modes
            mode?: 'DEFAULT' | 'DARK' | 'LIGHT' | string
        }
        // Optional. Web3Auth modal loading props.
        loaderProps?: LoadingScreenProps
        // Optional. Base modal button style props.
        buttonProps?: ButtonProps
        // Optional. Auto close modal on successful connector connect?
        closeModalOnConnect?: boolean
        // Optional. Hide injected wallets from root modal, useful when using Web3Modal
        // and you only want to show the Web3Modal connect button
        hideInjectedFromRoot?: boolean
        // Optional. Map of connector.id keys to visual extras
        connectorDisplayOverrides?: { 
            [connectorId: string]: {
                // Optional. Custom name to display on modal
                customName?: string // Default: undefined
                // Optional. Custom logo image to display on modal
                logo?: string // Default: undefined
                // Optional. 
                details?: string // Default: undefined
                // Optional. If defined, renders a dropdown-able text to describe connector
                infoText?: InfoTextMap // Default: undefined
                // Optional. If true, adds label on connector to flag that it is recommended
                isRecommended?: boolean // Default: false
                // Optional. Connector rank for sorting order in modal
                // e.g rank 20 will be above a rank 10 connector and be displayed before
                rank?: number // Default: 0
            }
        }
        // Optional.
        tabIndex?: 0 | -1
        // Optional.
        minHeight?: string
        // Optional.
        maxHeight?: string // Default: "600px"
        // Optional.
        maxWidth?: string // Default: "360px"
        // Optional.
        margin?: string // Default: "0px"
        // Optional. 
        initialFocusRef?: React.RefObject<any>
        // Optional.
        className?: string
        // Optional. React children to render inside Modal
        children?: React.ReactNode
    }
    w3a: {
        // Required. Web3Auth app name
        appName: string
        // Required. Web3Auth projectId from https://dashboard.web3auth.io
        projectId: WEB3AUTH_PROJECT_ID
        // Required. Web3Auth network.
        network: "mainnet" | "testnet" | "cyan" | "development" | "aqua"
        // Optional. Preset settings
        // "DISALLOW_EXTERNAL_WALLETS" = don't show external wallets
        // "ALLOW_EXTERNAL_WALLETS" = show external wallets to connect to (e.g injected)
        preset?: 'DISALLOW_EXTERNAL_WALLETS' | 'ALLOW_EXTERNAL_WALLETS' // Default: undefined
        // Optional. Storage save type: 'session' or 'local'
        storageKey?:'session' | 'local' // Default: 'local'
        // Optional. MFA level for web3auth
        mfaLevel?: 'default' | 'optional' | 'mandatory' | 'none' // Default: 'optional'
        // Optional. Web3Auth uxmode
        uxMode?: 'redirect' | 'popup' // Default: 'popup'
        // Optional. Configure function for adding connectors into web3auth.
        configureAdditionalConnectors?: (() => IPlugin[] | undefined) // Default: undefined
    }
    w3m: {
        // WalletConnect projectId. Get yours at https://cloud.walletconnect.com
        projectId: string
        // Optional. WalletConnect modal z-index.
        zIndex?: number // Default: 1000
        // Optional. Overridable WalletConnect modal theme variables.
        themeVariables?: {
            '--w3m-z-index'?: string;
            '--w3m-accent-color'?: string;
            '--w3m-accent-fill-color'?: string;
            '--w3m-background-color'?: string;
            '--w3m-background-image-url'?: string;
            '--w3m-logo-image-url'?: string;
            '--w3m-background-border-radius'?: string;
            '--w3m-container-border-radius'?: string;
            '--w3m-wallet-icon-border-radius'?: string;
            '--w3m-wallet-icon-large-border-radius'?: string;
            '--w3m-wallet-icon-small-border-radius'?: string;
            '--w3m-input-border-radius'?: string;
            '--w3m-notification-border-radius'?: string;
            '--w3m-button-border-radius'?: string;
            '--w3m-secondary-button-border-radius'?: string;
            '--w3m-icon-button-border-radius'?: string;
            '--w3m-button-hover-highlight-border-radius'?: string;
            '--w3m-font-family'?: string;
            '--w3m-font-feature-settings'?: string;
            '--w3m-text-big-bold-size'?: string;
            '--w3m-text-big-bold-weight'?: string;
            '--w3m-text-big-bold-line-height'?: string;
            '--w3m-text-big-bold-letter-spacing'?: string;
            '--w3m-text-big-bold-text-transform'?: string;
            '--w3m-text-big-bold-font-family'?: string;
            '--w3m-text-medium-regular-size'?: string;
            '--w3m-text-medium-regular-weight'?: string;
            '--w3m-text-medium-regular-line-height'?: string;
            '--w3m-text-medium-regular-letter-spacing'?: string;
            '--w3m-text-medium-regular-text-transform'?: string;
            '--w3m-text-medium-regular-font-family'?: string;
            '--w3m-text-small-regular-size'?: string;
            '--w3m-text-small-regular-weight'?: string;
            '--w3m-text-small-regular-line-height'?: string;
            '--w3m-text-small-regular-letter-spacing'?: string;
            '--w3m-text-small-regular-text-transform'?: string;
            '--w3m-text-small-regular-font-family'?: string;
            '--w3m-text-small-thin-size'?: string;
            '--w3m-text-small-thin-weight'?: string;
            '--w3m-text-small-thin-line-height'?: string;
            '--w3m-text-small-thin-letter-spacing'?: string;
            '--w3m-text-small-thin-text-transform'?: string;
            '--w3m-text-small-thin-font-family'?: string;
            '--w3m-text-xsmall-bold-size'?: string;
            '--w3m-text-xsmall-bold-weight'?: string;
            '--w3m-text-xsmall-bold-line-height'?: string;
            '--w3m-text-xsmall-bold-letter-spacing'?: string;
            '--w3m-text-xsmall-bold-text-transform'?: string;
            '--w3m-text-xsmall-bold-font-family'?: string;
            '--w3m-text-xsmall-regular-size'?: string;
            '--w3m-text-xsmall-regular-weight'?: string;
            '--w3m-text-xsmall-regular-line-height'?: string;
            '--w3m-text-xsmall-regular-letter-spacing'?: string;
            '--w3m-text-xsmall-regular-text-transform'?: string;
            '--w3m-text-xsmall-regular-font-family'?: string;
            '--w3m-overlay-background-color'?: string;
            '--w3m-overlay-backdrop-filter'?: string;
        };
        // Optional. WalletConnect modal theme.
        themeMode?: 'dark' | 'light'; // Default: 'light'
    }
```