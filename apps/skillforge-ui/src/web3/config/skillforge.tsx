import { frameConnectors } from '../connectors'
import { SUPPORTED_CHAINS } from './chains'
import { SupportedForgeChains, Web3ModalConfigWeb3Props } from '@past3lle/forge-web3'
import { PstlWeb3ModalProps } from '@past3lle/web3-modal'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { ASSETS_MAP } from 'assets'
import GOOGLE_APPLE_LOGO from 'assets/png/google-apple.png'
import React from 'react'
import { FORGE_LOGO_URL_MAP, pstlModalTheme as PSTL_MODAL_THEME } from 'theme/pstlModal'
import { skillforgeTheme as SKILLFORGE_THEME, skillforgeTheme } from 'theme/skillforge'

if (
  !process.env.REACT_APP_WEB3MODAL_ID ||
  !process.env.REACT_APP_WEB3AUTH_ID ||
  !process.env.REACT_APP_WEB3_AUTH_NETWORK
) {
  throw new Error('Missing W3A and/or W3M projectID env variables!')
}

export const SKILLFORGE_APP_NAME = 'SKILLFORGE'
export const WEB3_PROPS: Web3ModalConfigWeb3Props = {
  chains: SUPPORTED_CHAINS,
  frameConnectors,
  options: {
    pollingInterval: 10_000,
    autoConnect: true,
    chainFromUrlOptions: {
      type: 'network',
      key: 'forge-network'
    }
  },
  modals: {
    web3auth: {
      appName: SKILLFORGE_APP_NAME,
      // CYAN = USA focused
      network: process.env.REACT_APP_WEB3_AUTH_NETWORK as Required<
        PstlWeb3ModalProps<SupportedForgeChains>['modals']
      >['web3auth']['network'],
      projectId: process.env.REACT_APP_WEB3AUTH_ID as string,
      storageKey: 'session',
      preset: 'DISALLOW_EXTERNAL_WALLETS',
      mfaLevel: 'none',
      uxMode: 'redirect',
      themeInfo: {
        mode: 'dark',
        primary: skillforgeTheme.modes.DEFAULT.mainBg
      },
      appLogoDark: ASSETS_MAP.logos.forge[512],
      appLogoLight: ASSETS_MAP.logos.forge[512],
      url: 'https://skills.pastelle.shop',
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
            showTorusButton: true,
            useWalletConnect: true
          }
        })

        return [torusPlugin]
      }
    },
    walletConnect: {
      projectId: process.env.REACT_APP_WEB3MODAL_ID as string,
      themeMode: 'dark',
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
    root: {
      title: SKILLFORGE_APP_NAME + ' LOGIN',
      themeConfig: { theme: PSTL_MODAL_THEME },
      walletsView: 'list',
      maxHeight: '650px',
      maxWidth: '360px',
      margin: 'auto',
      closeModalOnConnect: true,
      hideInjectedFromRoot: true,
      connectorDisplayOverrides: {
        general: {
          infoText: {
            title: <strong>What can I do on this screen?</strong>,
            content: (
              <strong>
                {SKILLFORGE_APP_NAME} has an opt-in Web3 feature which allows you to collect SKILLS and SKILLPOINTS in
                exchange for completely new, and unique drop items. Clicking on SKILLS (the squares on the board) shows
                you the prerequisites for each new skill. To get started, please select a wallet choice below and
                connect! If you are new to Web3/blockchain, please select the recommended option below.
              </strong>
            )
          }
        },
        web3auth: {
          isRecommended: true,
          logo: GOOGLE_APPLE_LOGO,
          customName: 'Google & more'
        },
        walletconnect: {
          logo: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Gradient/Logo.png',
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
        spinnerProps: { size: 85 },
        loadingText: 'GETTING LOGIN...'
      }
    }
  }
}
