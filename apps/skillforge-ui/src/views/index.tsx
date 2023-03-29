import SkillForge, { SkillForgeProps, SkillForgeConnectedHeader } from '@past3lle/skillforge-widget'
import { RobotoVariableFontProvider } from '@past3lle/theme'
import { PstlWeb3ModalProps } from '@past3lle/web3-modal'
import { skillforgeTheme } from 'config/skillforge'
import { pstlModalTheme } from 'config/wallet'
import { SKILL_ID_BASE } from 'constants/skills'
import React, { ReactNode } from 'react'
import { GothicFontCssProvider } from 'theme/fonts'
import { GlobalStyles } from 'theme/global'
import { W3aStyles } from 'theme/w3aStyles'
import { SUPPORTED_CHAINS } from 'web3/config'
import { CONTRACT_ADDRESSES_MAP, METADATA_URIS_MAP } from 'web3/constants/addresses'

const APP_NAME = 'PSTL SKILLFORGE'
const WEB3_PROPS: PstlWeb3ModalProps = {
  appName: APP_NAME,
  chains: SUPPORTED_CHAINS,
  modals: {
    w3a: {
      appName: APP_NAME,
      network: 'mainnet',
      projectId: process.env.REACT_APP_WEB3AUTH_ID as string
    },
    w3m: {
      projectId: process.env.REACT_APP_WEB3MODAL_ID as string,
      walletImages: {
        web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
        safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
      },
      themeVariables: {
        '--w3m-background-color': skillforgeTheme.modes.DEFAULT.blackOpaque,
        '--w3m-accent-color': skillforgeTheme.modes.DEFAULT.blackOpaque,
        '--w3m-accent-fill-color': skillforgeTheme.modes.DEFAULT.mainBgAlt
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
          content: `${APP_NAME} has an opt-in Web3 feature which allows you to collect SKILLS and SKILLPOINTS in exchange for completely new, and unique drop items. Clicking on SKILLS (the squares on the board) shows you the prerequisites for each new skill. To get started, please select a wallet choice below and connect! If you are new to Web3/blockchain, please select "Social Login" below.`
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
      },
      loaderProps: {
        spinnerProps: { size: 100 }
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
      // some id's may NOT be simply 1,2,3...N
      // and instead 1000,2000,3000...N*1000
      // idBase is the base e.g 1000
      idBase: SKILL_ID_BASE
    }
  }
}
const FontsAndCssProviders = ({ children }: { children?: ReactNode }) => (
  <>
    <RobotoVariableFontProvider />
    <GothicFontCssProvider />
    <GlobalStyles />
    {children}
  </>
)

export function App() {
  return (
    <FontsAndCssProviders>
      <SkillForge config={SKILLTREE_CONFIG.config} maxWidth="90%" maxHeight="90%">
        <W3aStyles />
        <SkillForgeConnectedHeader />
      </SkillForge>
    </FontsAndCssProviders>
  )
}
