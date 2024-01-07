import { devDebug } from '@past3lle/utils'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import { PstlWeb3ModalProps } from '../providers'
import { createTheme } from '../theme'
import { ChainImages, ConnectorOverrides } from '../types'
import { chains } from './chains'

const BG_LOGO = 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-background.png'
// TESTING ID - DONT USE IN PROD
const WALLETCONNECT_TEST_ID = 'a01e2f3b7c64ff495f9cb28e4e2d4b49'
// TESTING KEY DO NOT USE IN PROD
export const WEB3AUTH_TEST_ID =
  'BHloyoLW113nGn-mIfeeNqj2U0wNCXa4y83xLnR6d3FELPMz_oZ7rbY4ZEO3r0MVjQ_LX92obu1ta0NknOwfvtU'

const WEB3AUTH_LOGO = 'https://www.getopensocial.com/wp-content/uploads/2020/12/social-login-COLOR_2.png'
const WALLETCONNECT_LOGO =
  'https://repository-images.githubusercontent.com/204001588/a5169900-c66c-11e9-8592-33c7334dfd6d'
export const FORGE_LOGO =
  'https://raw.githubusercontent.com/PAST3LLE/monorepo/main/apps/skillforge-ui/public/512_logo.png'

const ACCOUNT_BUTTON = {
  font: {
    textTransform: 'inherit'
  },
  background: {
    default: '#5a3e85a1',
    url: 'none'
  }
}
export const pstlModalTheme = createTheme({
  DEFAULT: {
    modals: {
      base: {
        baseFontSize: 16,
        background: {
          main: 'black',
          success: '#777b48',
          url: BG_LOGO
        },
        tooltip: {
          background: '#685985',
          font: {
            color: 'ghostwhite',
            family: 'monospace'
          }
        },
        font: {
          family: "'Roboto Flex', 'Inter', sans-serif, system-ui",
          letterSpacing: '0px'
        },
        closeIcon: {
          size: 45,
          color: 'ghostwhite',
          background: 'rgba(255,255,255,0.1)'
        },
        title: {
          font: {
            color: '#cbb9ee',
            size: '2.5em',
            style: 'italic',
            weight: 700,
            letterSpacing: '-1.4px',
            lineHeight: 0.82,
            textAlign: 'center'
          },
          margin: '0px 20px'
        },
        helpers: { show: true },
        error: {
          background: 'rgba(0,0,0, 0.65)'
        }
      },
      connection: {
        button: {
          main: {
            filter: 'invert(1) hue-rotate(65deg)',
            background: { default: '#2d222cbd', url: 'none' },
            height: '80px',
            icons: {
              height: '80%'
            },
            border: { border: 'none', radius: '1em' },
            font: {
              color: 'ghostwhite',
              size: '1em',
              style: 'normal',
              weight: 200,
              letterSpacing: '-1px',
              textShadow: '2px 2px 3px #0000005c',
              textTransform: 'uppercase'
            },
            hoverAnimations: true
          },
          active: {
            filter: 'invert(1) saturate(1.2)',
            background: { default: '#777b48' }
          }
        }
      },
      account: {
        icons: {
          copy: { url: 'https://img.icons8.com/?size=512&id=PoI08DwSsc7G&format=png', invert: false },
          network: { url: 'https://img.icons8.com/?size=512&id=PrryJ8KTxcOv&format=png', invert: false },
          wallet: { url: 'https://img.icons8.com/?size=512&id=O7exVeEFSVr3&format=png', invert: false }
        },
        text: {
          main: {
            weight: 500
          }
        },
        button: {
          main: {
            ...ACCOUNT_BUTTON,
            filter: 'invert(1) hue-rotate(65deg)'
          },
          alternate: {
            font: ACCOUNT_BUTTON.font,
            filter: 'hue-rotate(-5deg) contrast(1.3)',
            background: { default: 'indianred', url: 'none' }
          }
        },
        container: {
          main: {
            background: '#1113107a'
          },
          alternate: {
            background: '#1113107a'
          }
        }
      },
      transactions: {
        button: {
          main: {
            background: {
              default: '#6c5990'
            },
            font: {
              weight: 100
            }
          }
        },
        text: {
          main: {
            weight: 600
          },
          small: {
            weight: 100
          }
        }
      }
    }
  },
  get DARK() {
    return this.DEFAULT
  },
  LIGHT: {
    modals: {
      base: {
        baseFontSize: 5,
        background: {
          main: 'navajowhite',
          url: 'unset'
        }
      }
    }
  }
})

export const COMMON_CONNECTOR_OVERRIDES = {
  walletconnect: {
    logo: WALLETCONNECT_LOGO
  },
  web3auth: {
    isRecommended: true,
    logo: WEB3AUTH_LOGO
  },
  ledger: {
    customName: 'LEDGER LIVE',
    logo: 'https://crypto-central.io/library/uploads/Ledger-Logo-3.png',
    modalNodeId: 'ModalWrapper',
    rank: 0,
    isRecommended: true
  },
  'ledger-hid': {
    customName: 'LEDGER HID',
    logo: 'https://crypto-central.io/library/uploads/Ledger-Logo-3.png',
    rank: 10,
    isRecommended: true
  },
  coinbasewallet: {
    customName: 'Coinbase Wallet',
    logo: 'https://companieslogo.com/img/orig/COIN-a63dbab3.png?t=1648737284',
    rank: 12,
    downloadUrl: 'https://www.coinbase.com/wallet/downloads',
    isRecommended: true
  },
  taho: {
    logo: 'https://user-images.githubusercontent.com/95715502/221033622-fb606b37-93f1-485b-9ce5-59b92f756033.png',
    rank: 11,
    downloadUrl: 'https://taho.xyz/',
    isRecommended: false
  },
  metamask: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png',
    rank: 10,
    downloadUrl: 'https://metamask.io/downloads',
    isRecommended: true
  }
} as const

const CHAIN_IMAGES: ChainImages = {
  // unknown: 'https://img.freepik.com/premium-vector/unknown-mysterious-logo-sports_67734-82.jpg',
  137: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg'
}

const DEFAULT_PROPS: PstlWeb3ModalProps = {
  appName: 'COSMOS APP',
  chains,
  connectors: {
    overrides: COMMON_CONNECTOR_OVERRIDES
  },
  clients: {
    wagmi: {
      options: {
        publicClients: [
          {
            client: alchemyProvider,
            5: process.env.REACT_APP_ALCHEMY_GOERLI_API_KEY as string,
            137: process.env.REACT_APP_ALCHEMY_MATIC_API_KEY as string,
            80001: process.env.REACT_APP_ALCHEMY_MUMBAI_API_KEY as string
          }
        ]
      }
    }
  },
  options: {
    pollingInterval: 10_000,
    escapeHatches: {
      appType: 'DAPP'
    }
  },
  callbacks: {
    transactions: {
      onEoaTransactionConfirmed(tx) {
        devDebug('[@past3lle/web3-modal --> onEoaConfirmed] EOA transaction confirmed! Transaction:', tx)
        return tx
      },
      onEoaTransactionUnknown(tx) {
        devDebug('[@past3lle/web3-modal --> onEoaUnknown] EOA transaction status unknown!', tx)
        return tx
      }
    }
  },
  modals: {
    root: {
      headers: {
        wallets: 'Select wallet',
        account: 'Your account',
        networks: 'Select network'
      },
      themeConfig: { theme: pstlModalTheme },
      chainImages: CHAIN_IMAGES,
      closeModalOnConnect: false,
      hideInjectedFromRoot: true,
      loaderProps: {
        spinnerProps: {
          size: 80
        },
        fontSize: '3.2em'
      }
    },
    walletConnect: {
      projectId: WALLETCONNECT_TEST_ID,
      walletImages: {
        web3auth: 'https://web3auth.io/images/web3auth-L-Favicon-1.svg',
        safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
      }
    }
  }
}

const DEFAULT_PROPS_WEB3AUTH: PstlWeb3ModalProps = {
  ...DEFAULT_PROPS,
  connectors: {
    ...DEFAULT_PROPS.connectors,
    overrides: {
      ...((DEFAULT_PROPS.connectors as any)?.overrides as ConnectorOverrides),
      web3auth: {
        isRecommended: true,
        logo: WEB3AUTH_LOGO
      }
    }
  },
  modals: {
    ...DEFAULT_PROPS.modals,
    root: {
      ...DEFAULT_PROPS.modals.root
    }
  }
}

export { WALLETCONNECT_TEST_ID as WALLETCONNECT_ID, DEFAULT_PROPS, DEFAULT_PROPS_WEB3AUTH }
