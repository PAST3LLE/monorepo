import { SUPPORTED_CHAINS } from './chains'
import { ForgeW3CoreProvidersProps } from '@past3lle/forge-web3'
import { FORGE_LOGO_URL_MAP } from '@past3lle/web3-modal'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import React from 'react'
import { pstlModalTheme as PSTL_MODAL_THEME } from 'theme/pstlModal'
import { skillforgeTheme as SKILLFORGE_THEME } from 'theme/skillforge'

export const SKILLFORGE_APP_NAME = 'SKILLFORGE'
export const WEB3_PROPS: ForgeW3CoreProvidersProps['config']['web3'] = {
  chains: SUPPORTED_CHAINS,
  wagmiClient: {
    options: {
      pollingInterval: 10_000
    }
  },
  modals: {
    w3a: {
      appName: SKILLFORGE_APP_NAME,
      // TODO: change this once ready for production
      network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
      projectId: process.env.REACT_APP_WEB3AUTH_ID as string,
      configureAdditionalConnectors() {
        // Add Torus Wallet Plugin (optional)
        const torusPlugin = new TorusWalletConnectorPlugin({
          torusWalletOpts: {
            buttonPosition: 'bottom-right',
            modalZIndex: 999
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
      title: SKILLFORGE_APP_NAME + ' LOGIN',
      themeConfig: { theme: PSTL_MODAL_THEME },
      maxHeight: '650px',
      maxWidth: '360px',
      margin: 'auto',
      closeModalOnConnect: true,
      connectorDisplayOverrides: {
        general: {
          infoText: {
            title: <strong>What can I do on this screen?</strong>,
            content: (
              <strong>
                {SKILLFORGE_APP_NAME} has an opt-in Web3 feature which allows you to collect SKILLS and SKILLPOINTS in
                exchange for completely new, and unique drop items. Clicking on SKILLS (the squares on the board) shows
                you the prerequisites for each new skill. To get started, please select a wallet choice below and
                connect! If you are new to Web3/blockchain, please select "Social Login" below.
              </strong>
            )
          }
        },
        web3auth: {
          isRecommended: true,
          customName: 'Email/SMS/Social',
          infoText: {
            title: <strong>How does Email/SMS/Social login work?</strong>,
            content: (
              <strong>
                Social login is done via Web3Auth - a non-custodial social login protocol (i.e they never actually know,
                or hold your data) - which facilitates logging into Dapps (decentralised apps) via familiar social media
                login choices.
              </strong>
            )
          }
        },
        walletConnect: {
          customName: 'Web3',
          infoText: {
            title: <strong>What is web3?</strong>,
            content: (
              <strong>
                Web3 wallets are digital currency storage apps (or more simply called, wallets), used for storing
                cryptocurrency as well as connecting to Dapps (decentralised apps). This generally requires more
                blockchain knowledge.
              </strong>
            )
          }
        }
      },
      loaderProps: {
        spinnerProps: { size: 85 }
      }
    }
  }
}
