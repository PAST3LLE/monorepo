import { Column, Row } from '@past3lle/components'
import { useIsMobile } from '@past3lle/hooks'
import { ForgeW3CoreProvidersProps } from '@past3lle/skillforge-web3'
import SkillForge, { SkillForgeProps, SkillForgeConnectedHeader } from '@past3lle/skillforge-widget'
import { RobotoVariableFontProvider } from '@past3lle/theme'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { AppVersion } from 'components/AppVersion'
import { skillforgeTheme as SKILLFORGE_THEME } from 'config/skillforge'
import { FORGE_LOGO_URL_MAP, pstlModalTheme } from 'config/wallet'
import { GATEWAY_URIS, GATEWAY_API_URIS } from 'constants/ipfs'
import React, { ReactNode } from 'react'
import { GothicFontCssProvider } from 'theme/fonts'
import { GlobalStyles } from 'theme/global'
import { W3aStyles } from 'theme/w3aStyles'
import { SUPPORTED_CHAINS } from 'web3/config'
import { CONTRACT_ADDRESSES_MAP } from 'web3/constants/addresses'
import { METADATA_URIS_MAP } from 'web3/constants/metadata'

const APP_NAME = 'SKILLFORGE'
const WEB3_PROPS: ForgeW3CoreProvidersProps['config']['web3'] = {
  chains: SUPPORTED_CHAINS,
  modals: {
    w3a: {
      appName: APP_NAME,
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
      title: APP_NAME + ' LOGIN',
      theme: pstlModalTheme,
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
                {APP_NAME} has an opt-in Web3 feature which allows you to collect SKILLS and SKILLPOINTS in exchange for
                completely new, and unique drop items. Clicking on SKILLS (the squares on the board) shows you the
                prerequisites for each new skill. To get started, please select a wallet choice below and connect! If
                you are new to Web3/blockchain, please select "Social Login" below.
              </strong>
            )
          }
        },
        web3auth: {
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

const SKILLTREE_CONFIG: SkillForgeProps = {
  config: {
    name: APP_NAME,
    theme: SKILLFORGE_THEME,
    web3: WEB3_PROPS,
    contractAddresses: CONTRACT_ADDRESSES_MAP,
    metadataUris: METADATA_URIS_MAP,
    skillOptions: {
      metadataFetchOptions: {
        gatewayUris: GATEWAY_URIS,
        gatewayApiUris: GATEWAY_API_URIS
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
      <Column width="100%">
        <Row height={'100vh'}>
          <SkillForge
            config={SKILLTREE_CONFIG.config}
            maxWidth={isMobile ? '100%' : '90%'}
            maxHeight={isMobile ? '100%' : '90%'}
          >
            <W3aStyles />
            <SkillForgeConnectedHeader />
          </SkillForge>
        </Row>
        <Row marginBottom={-100} height={100} style={{ position: 'relative' }}>
          <AppVersion />
        </Row>
      </Column>
    </FontsAndCssProviders>
  )
}
