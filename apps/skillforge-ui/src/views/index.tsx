import { useIsMobile } from '@past3lle/hooks'
import SkillForge, { SkillForgeProps, SkillForgeConnectedHeader } from '@past3lle/skillforge-widget'
import { RobotoVariableFontProvider } from '@past3lle/theme'
import { PstlWeb3ModalProps } from '@past3lle/web3-modal'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { skillforgeTheme as SKILLFORGE_THEME } from 'config/skillforge'
import { FORGE_LOGO_URL_MAP, pstlModalTheme } from 'config/wallet'
import { GATEWAY_URIS } from 'constants/ipfs'
import { SKILL_ID_BASE } from 'constants/skills'
import React, { ReactNode } from 'react'
import { GothicFontCssProvider } from 'theme/fonts'
import { GlobalStyles } from 'theme/global'
import { W3aStyles } from 'theme/w3aStyles'
import { SUPPORTED_CHAINS } from 'web3/config'
import { CONTRACT_ADDRESSES_MAP } from 'web3/constants/addresses'
import { METADATA_URIS_MAP } from 'web3/constants/metadata'

const APP_NAME = 'PSTL SKILLFORGE'
const WEB3_PROPS: PstlWeb3ModalProps = {
  appName: APP_NAME,
  chains: SUPPORTED_CHAINS,
  modals: {
    w3a: {
      appName: APP_NAME,
      // TODO: change this once ready for production
      network: 'testnet',
      listingName: 'Email/SMS/Social',
      projectId: process.env.REACT_APP_WEB3AUTH_ID as string,
      configureAdditionalConnectors() {
        // Add Torus Wallet Plugin (optional)
        const torusPlugin = new TorusWalletConnectorPlugin({
          torusWalletOpts: {
            buttonPosition: 'bottom-left'
          },
          walletInitOptions: {
            whiteLabel: {
              theme: {
                isDark: true,
                colors: {
                  torusBrand1: SKILLFORGE_THEME.modes.ALT.mainBg,
                  torusBrand2: SKILLFORGE_THEME.modes.DEFAULT.mainBg
                }
              },
              logoDark: FORGE_LOGO_URL_MAP[500]['1x'],
              logoLight: FORGE_LOGO_URL_MAP[500]['1x']
            },
            useWalletConnect: false
          }
        })

        return [torusPlugin]
      }
    },
    w3m: {
      projectId: process.env.REACT_APP_WEB3MODAL_ID as string,
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
    pstl: {
      theme: pstlModalTheme,
      maxHeight: '650px',
      maxWidth: '360px',
      margin: 'auto',
      closeModalOnConnect: true,
      infoTextMap: {
        general: {
          title: <strong>What can I do on this screen?</strong>,
          content: (
            <strong>
              {APP_NAME} has an opt-in Web3 feature which allows you to collect SKILLS and SKILLPOINTS in exchange for
              completely new, and unique drop items. Clicking on SKILLS (the squares on the board) shows you the
              prerequisites for each new skill. To get started, please select a wallet choice below and connect! If you
              are new to Web3/blockchain, please select "Social Login" below.
            </strong>
          )
        },
        web3auth: {
          title: <strong>How does this login work?</strong>,
          content: (
            <strong>
              Social login is done via Web3Auth - a non-custodial social login protocol (i.e they never actually know,
              or hold your data) - which facilitates logging into Dapps (decentralised apps) via familiar social media
              login choices.
            </strong>
          )
        },
        walletConnect: {
          title: <strong>What is WalletConnect?</strong>,
          content: (
            <strong>
              WalletConnect (presented here as Web3Modal) is a simple blockchain wallet aggregator modal that
              facilitates the choice of selecting preferred blockchain wallet(s) for connecting to Dapps (decentralised
              apps). This generally requires more blockchain knowledge.
            </strong>
          )
        }
      },
      loaderProps: {
        spinnerProps: { size: 85 }
      }
    }
  }
}

const SKILLTREE_CONFIG: SkillForgeProps = {
  config: {
    name: APP_NAME,
    theme: SKILLFORGE_THEME,
    web3: WEB3_PROPS,
    contractAddresses: CONTRACT_ADDRESSES_MAP,
    metadataUris: METADATA_URIS_MAP,
    skillOptions: {
      // some id's may NOT be simply [1,2,3...N] and instead 1000,2000,3000...N*1000
      // idBases in PSTL SkillForge = 1000
      idBase: SKILL_ID_BASE,
      metadataFetchOptions: {
        gatewayUris: GATEWAY_URIS
      }
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
  const isMobile = useIsMobile()
  return (
    <FontsAndCssProviders>
      <SkillForge
        config={SKILLTREE_CONFIG.config}
        maxWidth={isMobile ? '100%' : '90%'}
        maxHeight={isMobile ? '100%' : '90%'}
      >
        <W3aStyles />
        <SkillForgeConnectedHeader />
      </SkillForge>
    </FontsAndCssProviders>
  )
}
