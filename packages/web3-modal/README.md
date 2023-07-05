<img width="438" alt="image" src="https://lh3.googleusercontent.com/fife/APg5EOZGB0x6KiHp8lG2eeC0VWz4Sq7eUdo_eZKJUGW-cuq1SZgAcKRGHC-Ic24BlrG7HxYHgw8DCWl-df9OYaBj5HcQLXkj0ZjaBFT-RTGhQVCAmG44b1V7vdhm0dRmGCmvLT_RhmjNQBOrwakKGdA1GnlG3u6bd2IoajIpAdmdKu4CWxacH9to9-ZHOeaW_kpmYl-k85iIGSxBNSdkbO4kI8hcEp0tkEi84vNSRHGPq8bJ1YPXOZ2MDiVxnIxrNXMi6AQUSCtB6wl3pmZcJa_iIVQ4Bhq2QFn0PgemTotNk1I662g1gX-fYzv9rgegOAfnnK6J7AQ9z-goIvFcohEQ8LrG5bjoahr1CnpVSaNW1Oj7ycuzcBfrBJkVags5MWBH-2YCsQ0FbaazH0tBUDe8kjIsrwe814ZQ1bt3IurBMgHw3wD1mAMSawOJ7xz5V45-HRvbRopciMqjX-O8ge5In5jujIc7EbghGvnVAmxyeI7eKpD5iNbFno-HhsR2UF5E3_QC5036vcpjH9GncEwp66nIGndD0H6SRYz6bHt-1rKsqxTDY7CahSkkd1tPZw0a5lMO5TnFTH3K46QAQ3uP_zkaHxg8P1rwCMfezkUorL3Ux4otxO1ZijRs-ip3EC3FuX0tHUUMUAvuCBgmotRKHU-v_tOUUNCoQOmD7UO5DYtMsvRWTHnrcBmoFyr3he2tJFrXnf_UdFhnMhJaFHVZO5Pq9Qs4_9lPnEvnT5B_SbgAJX-nuLBT2o4Ncd_NQnkyK9Occ92TjF2WLHMCHsPk-OyTNGsGuAZ52iAxQvsHBWcRaF-Ne5i2C-k6QwPgk6EtRquPsAVTb07YB_q-ZDOPpm-jsL5WLhT3WhTsaOiIg4pg5CeqTYj192c2N-Er_s2BkrU4eFpPl2mAy-C5tMECu-XIprYilg932xdapJWPHTCsWDyUM2qn28I-q6ijl_A2-UKxlsZ_QE4Z4r-AzwgNfykkE_4NpEgL-gLlDUKanasQwtg8Y1pmvzpwCD5SmEXunSm_9lxZxpSVCgo18t-PlZ6HKdcs1a9Vudw2VGa7m4E6ViiQwRsZ2R_Xo2TQfHtfZ_dTCsgW3UhBHcDVW0ziz3eC-YXiiNecIUtYsHOjRlJJhX4kfpoWCaUDnaaIk8TsH2Xd68LJKrt5kPzyYXvZVIw87WySCm29Bq_ZaAyxNUQwTVvXsx9aAK05V7w9YvbMwfyD_8WXd8cwCTf3UCjO9bX3KWIuYKcnDLPGkFQNb_wX-tcgbh9VWYTvJe0onN_mZ845Jcj0onPzgBHmVf41jlYSlo1-R4tJrHg58Ixe9DqdwL1IF2Vg4z6GrNzy20Eg2zv-o7mi5AMVMiE62B0t4c44hGbzIKYBozgdWp8h5r-arQg9Ae8muGwhG42SIeuEEZYjmW9E1A9Jw65j2DJwhIdUcOydP7ANAd3VbSi1JNAitIPKZ1gD-rlW9c1c9ZrGTzX-r1PrIOzodODzP7QDCXqjfmvyqaTQves-Ls0Al49QGAaMwJW-Gv_4f2rZvEB0_STxRLRt-AozIB5Urmxghh23uhD2JOCOnLu7tI-L_7Eq036l2gg=w2880-h1642">

# Web3 Modal

<img width="438" alt="image" src="https://github.com/PAST3LLE/monorepo/assets/21335563/2411d147-0c2f-4f4c-aed3-0a0236b30223">

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
import { PstlWeb3ModalProps, addConnector } from '@past3lle/web3-modal'
import { mainnet } from '@wagmi/chains'
import modalTheme, { PALETTE } from 'theme'

import { LedgerConnector } from 'wagmi/connectors/ledger'
import { LedgerHIDConnector } from '@past3lle/wagmi-connectors'

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
// import from wagmi (see above)
const chains = [mainnet]
// cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = 'WALLETCONNECT_PROJECT_ID'
// dashboard.web3auth.io
const WEB3AUTH_PROJECT_ID = 'WEB3AUTH_PROJECT_ID'

const config = {
  appName: 'Test App',
  chains,
  connectors: [
      // Adds LedgerHID connector
      addConnector(LedgerHIDConnector, {}),
      // Adds LedgerLive modal connector
      addConnector(LedgerConnector, { 
        projectId: WALLETCONNECT_PROJECT_ID, 
        walletConnectVersion: 2 
      }),
      // Adds MetaMask injected connector
      addConnector(InjectedConnector, {
        name: 'MetaMask',
        shimDisconnect: true,
        getProvider() {
          try {
            // You may need to (window as any)?.ethereum? ...
            // Or create a declarations.d.ts file in your /src/ root
            const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
            if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
            return provider
          } catch (error) {
            return undefined
          }
        }
      }),
  ],
  options: {
    // How often to poll for new data
    pollingInterval: 20_000,
    // If you want to try and load chain/network data from URL
    // WARNING: this can be unreliable depending on the base app's existing URL logic
    chainFromUrlOptions: { 
      // Type: 'network' | 'chain' (network == name of network & chain == chainId)
      type: 'network', 
      // URL key to look for
      // e.g { type: 'network', key: 'web3-network' } ==> https://your-dapp-url.io/?web3-network=goerli
      // e.g { type: 'chain', key: 'web3-chain' } ==> https://your-dapp-url.io/?web3-chain=5
      key: 'web3-modal-network' 
    },
  },
  // frameConnectors : [], <-- Connectors to use ONLY in iFrame Dapp browsers (e.g LedgerLive)
  // Defaults to IFrameEthereum connector in iFrame mode so there is likely nothing you need to add here
  modals: { 
    root: {
      // Auto detect connection and close modal
      closeModalOnConnect: true,
      // Base z-index of root modal. Should be lowest in the hierarchy of modals, but higher than your lower app
      zIndex: ZIndices.BASE,
      title: 'TITLE HERE',
      // Create a theme object via the aptly named, `createTheme` function
      themeConfig: {
        theme: modalTheme
      },
      // Hide (non-specified) injected wallets from modal
      // E.g you add MetaMask in the connectors prop above but don't want detection for Taho if user has it
      hideInjectedFromRoot: true,
      // Key/value pair of connector UI overrides
      connectorDisplayOverrides: {
        ledger: {
          logo:
            'https://play-lh.googleusercontent.com/mHjR3KaAMw3RGA15-t8gXNAy_Onr4ZYUQ07Z9fG2vd51IXO5rd7wtdqEWbNMPTgdqrk',
          customName: 'LEDGER LIVE',
          infoText: {
            title: 'What is this option?',
            content: 'Choose this to connect with your Ledger hardware wallet via the LedgerLive desktop app!'
          },
          rank: WalletRank['ledger']
        },
        metamask: {
          logo: 'https://metamask-logo.io',
          customName: 'Annoying FOX provider',
          rank: 100,
          // Optional. Open a new tab to this URL if provider/connector not injected/found.
          downloadUrl: 'https://metamask.io/download/'
        }
      }
    },
    // Web3Auth is built in. Leave this undefined (or empty) to not include as a connector/provider
    web3auth: {
      appName: 'Test App',
      projectId: WEB3AUTH_PROJECT_ID,
      network: 'testnet',
      preset: 'DISALLOW_EXTERNAL_WALLETS'
    },
    // WalletConnect Web3Modal props.
    walletConnect: {
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
// Optional. Array of connectors creator functions to add. E.g LedgerConnector as shown in the example implementation.
connectors?: ((chains: Chain[]) => Connector<any, any>)[] // Default: undefined
options?: {
  // Optional. Options for getting the chain info from URL.
  // type: 'network' expects url schema: "someUrl.com/?network=goerli
  // type: 'id' expects url schema: "someUrl.com/?id=5
  chainFromUrlOptions?: { key: string; type: 'network' | 'id' }
  // Optional. Polling interval in milliseconds.
  pollingInterval?: number // Default: 4000 (4s)
  // Optional. Reconnects last connected provider on reload.
  autoConnect?: boolean // Default: false
}
// Optional. Advanced. 
// WagmiClient props. 
// We recommended NOT changing/adding anything here and letting the app handle this.
// If you need more options, use the root.options prop (see above)
wagmiClient?: {
    // Optional. Client is automatically created for you if left undefined here.
    // We recommend not passing a client here and letting the app create one for you.
    client?: WagmiClient
    // Optional. Wagmi creation options. Using the root "options" prop WILL OVERRIDE props of the same name.
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
// Optional. Advanced.
// Ethereum client props.
// If blank, app handles creation of Ethereum client.
// We recommend NOT passing your own and letting the app handle this.
ethereumClient?: EthereumClient
modals: {
    root?: {
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
        // Optional. Displays modal in a grid or list view.
        walletView?: 'list' | 'grid' // Default: 'list'
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
    // Optional. Omit to remove Web3Auth connector
    web3auth: {
        // Required. Web3Auth app name
        appName: string
        // Required. Web3Auth projectId from https://dashboard.web3auth.io
        projectId: WEB3AUTH_PROJECT_ID
        // Required. Web3Auth network.
        network: "mainnet" | "cyan" | "development" | "aqua"
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
    // WalletConnect -> Web3Modal props
    walletConnect: {
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
