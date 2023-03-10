import SkillForge, { SkillForgeProps, SkillForgeConnectedHeader } from '@past3lle/skillforge-widget'
import { FontCssProvider, createPast3lleTemplateTheme } from '@past3lle/theme'
import { ASSETS_MAP } from 'assets'
import { SKILL_ID_BASE } from 'constants/skills'
import React from 'react'
import { GothicFontCssProvider } from 'theme/fonts'
import { SUPPORTED_CHAINS } from 'web3/config'
import { CONTRACT_ADDRESSES_MAP, METADATA_URIS_MAP } from 'web3/constants/addresses'

const skilltreeTheme = createPast3lleTemplateTheme('SKILLTREE', {
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
const CLIENT_PROPS = {
  appName: 'PSTL SKILLTREE',
  walletConnect: {
    projectId: process.env.REACT_APP_WALLETCONNECT_KEY as string,
    chains: SUPPORTED_CHAINS
  }
}

const SKILLTREE_CONFIG: SkillForgeProps = {
  config: {
    name: CLIENT_PROPS.appName,
    theme: skilltreeTheme,
    web3: {
      walletconnectProvider: CLIENT_PROPS.walletConnect
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
    <SkillForge config={SKILLTREE_CONFIG.config} maxWidth={1200} maxHeight={750}>
      <FontCssProvider />
      <GothicFontCssProvider />
      <SkillForgeConnectedHeader />
    </SkillForge>
  )
}
