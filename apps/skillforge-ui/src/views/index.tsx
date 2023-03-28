import SkillForge, { SkillForgeProps, SkillForgeConnectedHeader } from '@past3lle/skillforge-widget'
import { FontCssProvider, createPast3lleTemplateTheme } from '@past3lle/theme'
import { ASSETS_MAP } from 'assets'
import { SKILL_ID_BASE } from 'constants/skills'
import React from 'react'
import { GothicFontCssProvider } from 'theme/fonts'
import { W3aStyles } from 'theme/w3aStyles'
import { SUPPORTED_CHAINS } from 'web3/config'
import Web3AuthConnectorInstance from 'web3/connectors/web3auth'
import { CONTRACT_ADDRESSES_MAP, METADATA_URIS_MAP } from 'web3/constants/addresses'

export const skilltreeTheme = createPast3lleTemplateTheme('SKILLFORGE', {
  DEFAULT: {
    assetsMap: ASSETS_MAP
  },
  ALT: {
    mainBgAlt: 'darkred',
    mainBg: 'cornflowerblue',
    mainFg: 'cyan',
    rarity: {
      common: {
        backgroundColor: 'yellow'
      }
    },
    assetsMap: ASSETS_MAP
  }
})
const APP_NAME = 'PSTL SKILLTREE'
const CLIENT_PROPS = {
  appName: APP_NAME,
  web3Auth: {
    appName: APP_NAME,
    w3aId: process.env.REACT_APP_WEB3AUTH_ID as string
  },
  web3Modal: {
    w3mId: process.env.REACT_APP_WEB3MODAL_ID as string,
    walletImages: {
      web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
      safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
    }
  }
}

const SKILLTREE_CONFIG: SkillForgeProps = {
  config: {
    name: CLIENT_PROPS.appName,
    theme: skilltreeTheme,
    web3: {
      chains: SUPPORTED_CHAINS,
      web3Modal: CLIENT_PROPS.web3Modal,
      web3Auth: CLIENT_PROPS.web3Auth,
      wagmiClient: {
        options: {
          autoConnect: true,
          connectors: [Web3AuthConnectorInstance(SUPPORTED_CHAINS)]
        }
      }
    },
    contractAddresses: CONTRACT_ADDRESSES_MAP,
    metadataUris: METADATA_URIS_MAP,
    skillOptions: {
      idBase: SKILL_ID_BASE
    }
  }
}

export function App() {
  return (
    <SkillForge config={SKILLTREE_CONFIG.config} maxWidth="90%" maxHeight="90%">
      <W3aStyles />
      <FontCssProvider />
      <GothicFontCssProvider />
      <SkillForgeConnectedHeader />
    </SkillForge>
  )
}
