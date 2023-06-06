import { ForgeW3Providers } from '@past3lle/forge-web3'
import { ThemeChangerButton } from '@past3lle/skillforge-widget'
import {
  StaticGlobalCssProvider,
  ThemeProvider,
  createCustomTheme,
  urlToSimpleGenericImageSrcSet
} from '@past3lle/theme'
import * as React from 'react'
import 'react-app-polyfill/ie11'
import * as ReactDOM from 'react-dom/client'

import THEME_BUTTON_IMAGE from './assets/pixelated-shirt.png'
import { commonProps, contractProps } from './config/skillforge-web3'
import { PstlStaticGlobalCss } from './styles/global'
import { App } from './views/App'

const StaticCssProviders = () => (
  <>
    <StaticGlobalCssProvider />
    <PstlStaticGlobalCss />
  </>
)

const appTheme = createCustomTheme({
  modes: {
    DEFAULT: {
      red1: 'red',
      red2: 'orange'
    },
    DARK: {
      red1: 'indianred',
      red2: 'darkred'
    },
    LIGHT: {}
  }
})
const IPFS_GATEWAY_URI_MAP = {
  PINATA: 'https://gateway.pinata.cloud/ipfs',
  INFURA: 'https://infura-ipfs.io/ipfs',
  PASTELLE_INFURA: 'https://pastelle.infura-ipfs.io/ipfs',
  DEFAULT_IPFS: 'https://ipfs.io/ipfs'
}

const GATEWAY_URIS: any[] = [
  {
    gateway: IPFS_GATEWAY_URI_MAP.PASTELLE_INFURA,
    config: {
      // init: INFURA_IPFS_HEADERS
    }
  },
  {
    gateway: IPFS_GATEWAY_URI_MAP.INFURA,
    config: {
      // init: INFURA_IPFS_HEADERS
    }
  },
  {
    gateway: IPFS_GATEWAY_URI_MAP.PINATA,
    config: {
      // init: PINATA_IPFS_HEADERS
    }
  },
  {
    gateway: IPFS_GATEWAY_URI_MAP.DEFAULT_IPFS
  }
]

/**
 * Curried theme functions to get theme items
 */

const container = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(container)

function AppControl() {
  return (
    <ForgeW3Providers
      config={{
        name: 'PASTELLE SHOP',
        web3: commonProps,
        contractAddresses: contractProps.contractAddresses,
        metadataUris: contractProps.metadataUris,
        skillOptions: {
          metadataFetchOptions: {
            gatewayUris: GATEWAY_URIS
          }
        }
      }}
    >
      {/* We need a top level ThemeProvider from @past3lle to feed components proper default theme */}
      <ThemeProvider theme={appTheme} defaultMode="DARK">
        <App />
        <ThemeChangerButton
          label="Change SkillForge Theme"
          backgroundColor={'springgreen'}
          bgBlendMode="exclusion"
          bgAttributes={['center / cover no-repeat', '5px / cover repeat']}
          bgImage={urlToSimpleGenericImageSrcSet(THEME_BUTTON_IMAGE)}
        />
      </ThemeProvider>
    </ForgeW3Providers>
  )
}

root.render(
  <>
    <StaticCssProviders />
    <AppControl />
  </>
)
