import SkillForge, { SkillForgeProps, SkillForgeConnectedHeader } from '@past3lle/skillforge-widget'
import { FontCssProvider } from '@past3lle/theme'
import { PstlW3ProviderProps } from '@past3lle/web3-modal'
import { skillforgeTheme } from 'config/skillforge'
import { pstlModalTheme } from 'config/wallet'
import { SKILL_ID_BASE } from 'constants/skills'
import React from 'react'
import { GothicFontCssProvider } from 'theme/fonts'
import { W3aStyles } from 'theme/w3aStyles'
import { SUPPORTED_CHAINS } from 'web3/config'
import { CONTRACT_ADDRESSES_MAP, METADATA_URIS_MAP } from 'web3/constants/addresses'

const APP_NAME = 'PSTL SKILLFORGE'
const WEB3_PROPS: PstlW3ProviderProps = {
  appName: APP_NAME,
  chains: SUPPORTED_CHAINS,
  modals: {
    w3a: {
      appName: APP_NAME,
      network: 'mainnet',
      w3aId: process.env.REACT_APP_WEB3AUTH_ID as string
    },
    w3m: {
      w3mId: process.env.REACT_APP_WEB3MODAL_ID as string,
      walletImages: {
        web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
        safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
      }
    },
    pstl: {
      theme: pstlModalTheme,
      maxHeight: '650px',
      maxWidth: '360px',
      margin: 'auto',
      closeModalOnConnect: false,
      infoTextMap: {
        general: {
          title: 'What can I do on this modal?',
          content:
            "This is some helper filler text to describe wtf is going on in this connection modal. It is useful to learn these things while browsing apps as users can get confused when having to exit apps to read info somewhere else that isn't the current screent they are on."
        },
        web3auth: {
          title: 'What is social login?',
          content:
            'Social login is done via Web3Auth - a non-custodial social login protocol (i.e they never actually know, or hold your data) - which facilitates logging into dApps (decentralised apps) via familiar social login choices'
        },
        walletConnect: {
          title: 'What is wallets login?',
          content:
            'Web3Modal/WalletConnect is a simple blockchain wallet aggregator modal that facilitates the choice of selecting preferred blockchain wallet(s) for connecting to dApps (decentralised apps). This generally requires more blockchain knowledge.'
        }
      }
    }
  }
}

const SKILLTREE_CONFIG: SkillForgeProps = {
  config: {
    name: APP_NAME,
    theme: skillforgeTheme,
    web3: WEB3_PROPS,
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
