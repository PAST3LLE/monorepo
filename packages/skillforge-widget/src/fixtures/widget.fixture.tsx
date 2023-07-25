import { useW3Connection } from '@past3lle/forge-web3'
import React from 'react'

import { SkillForge, SkillForgeConnectedHeader } from '../components'
import { createTheme } from '../theme/utils'
import { commonProps, contractProps } from './config'

/* 
    interface Web3ModalProps {
        appName: string
        web3Modal: Web3ModalConfig
        wagmiClient?: SkillForgeW3WagmiClientOptions
        ethereumClient?: EthereumClient
    }
*/

function InnerApp() {
  const [, { openRootModal, openWalletConnectModal }, { address }] = useW3Connection()

  return (
    <div>
      <button
        onClick={() =>
          address ? openWalletConnectModal({ route: 'Account' }) : openRootModal({ route: 'ConnectWallet' })
        }
      >
        Open Pstl Web3 Modal
      </button>
      <h1>{address || 'Disconnected'}</h1>
    </div>
  )
}

const skillforgeTheme = createTheme({
  ALT: {
    mainBgAlt: '#1A1A1A',
    assetsMap: {
      logos: {
        company: {
          full: '	https://pastelle.shop/static/media/pastelle-ivory-outlined.06d3dadfc9e4e7c2c8904b880bf4067c.svg'
        },
        forge: { '512': 'FORGE_512' }
      }
    }
  },
  DEFAULT: {
    assetsMap: {
      logos: {
        company: {
          full: '	https://pastelle.shop/static/media/pastelle-ivory-outlined.06d3dadfc9e4e7c2c8904b880bf4067c.svg'
        },
        forge: { '512': 'FORGE_512' }
      },
      images: {
        background: {
          app: 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-background.png',
          header: {
            background:
              'https://e7.pngegg.com/pngimages/977/1011/png-clipart-blue-banner-design-page-header-web-banner-header-miscellaneous-blue.png',
            account: 'ACCOUNT_BACKGROUND'
          }
        },
        skills: {
          skillpoint: {
            highlight:
              'https://www.transparentpng.com/download/red-circle/rotation-effect-red-circle-logo-transparent-free-5mbxgt.png',
            empty:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Blank_square.svg/1200px-Blank_square.svg.png'
          }
        }
      },
      icons: {
        locked: 'LOCK_ICON',
        connection: 'CONNECTION_ICON',
        inventory: 'INVENTORY_ICON',
        shop: 'SHOP_ICON',
        chains: {
          disconnected: 'CONNECTION_ICON',
          5: 'ETHEREUM_LOGO',
          137: 'MATIC_LOGO',
          80001: 'POLYGON_LOGO'
        },
        rarity: {
          empty: '',
          common: 'COMMON_RARITY_ICON',
          rare: 'RARE_RARITY_ICON',
          legendary: 'LEGENDARY_RARITY_ICON',
          epic: 'EPIC_RARITY_ICON'
        }
      }
    }
  }
})
function App() {
  return (
    <SkillForge
      dimensions={{
        mobile: {
          width: {
            max: '100%'
          }
        },
        desktop: {
          width: {
            max: '80%'
          },
          height: {
            max: '80%'
          }
        }
      }}
      config={{
        ...contractProps,
        name: 'Skillforge Widget Fixture',
        boardOptions: {
          minimumColumns: 3,
          minimumBoardWidth: 0
        },
        theme: skillforgeTheme,
        contactInfo: {
          email: 'fixture@fuxtire.gmail.com'
        },
        contentUrls: {
          FAQ: 'faq.thing.io'
        },
        web3: {
          chains: commonProps.chains,
          options: {
            pollingInterval: 15_000
          },
          modals: {
            walletConnect: commonProps.modals.walletConnect,
            web3auth: commonProps.modals.web3auth
          }
        },
        hooksProviderOptions: {
          windowSizes: {
            throttleMs: 1500
          }
        }
      }}
      render={() => <SkillForgeConnectedHeader />}
    >
      <InnerApp />
    </SkillForge>
  )
}

export default {
  default: <App />
}
