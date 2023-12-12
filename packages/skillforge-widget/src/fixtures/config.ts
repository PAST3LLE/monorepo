import { ForgeW3CoreProvidersProps, addConnector, createWeb3ModalTheme } from '@past3lle/forge-web3'
import { LedgerHIDConnector } from '@past3lle/wagmi-connectors'
import { polygon } from 'wagmi/chains'

const MODAL_THEME = createWeb3ModalTheme({
  DEFAULT: {
    modals: {
      base: {
        input: {
          font: {
            color: 'black'
          }
        },
        title: {
          font: {
            color: 'navajowhite'
          }
        },
        background: {
          main: 'rgba(0,0,0,0.6)'
        }
      },
      connection: {
        button: {
          main: {
            font: { color: 'black' },
            background: {
              default: 'navajowhite'
            }
          }
        }
      },
      account: {
        text: {
          main: {
            color: 'black',
            weight: 500
          },
          header: { color: 'black' },
          subHeader: {
            color: 'black'
          }
        },
        container: {
          main: {
            background: '#202020'
          },
          alternate: {
            background: 'navajowhite'
          }
        },
        button: {
          main: {
            font: {
              color: 'ghostwhite'
            },
            background: {
              default: 'rgba(0,0,0,0.5)'
            }
          },
          alternate: {
            background: {
              default: 'indianred'
            }
          }
        }
      }
    }
  }
})
const DEFAULT_PROPS: ForgeW3CoreProvidersProps['config']['web3'] = {
  chains: [polygon],
  connectors: {
    connectors: [addConnector(LedgerHIDConnector, {})],
    overrides: {
      'ledger-hid': {
        customName: 'Ledger HID Device',
        async customConnect({ store, connector, wagmiConnect }) {
          await wagmiConnect({ connector })
          store.root.open({ route: 'HidDeviceOptions' })
        }
      }
    }
  },
  modals: {
    root: {
      themeConfig: {
        theme: MODAL_THEME
      }
    },
    walletConnect: {
      projectId: process.env.REACT_APP_WEB3MODAL_ID || '',
      walletImages: {
        web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
        safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
      }
    }
  }
}
const DEFAULT_CONFIG_PROPS: Pick<ForgeW3CoreProvidersProps['config'], 'contractAddresses' | 'metadataUris'> = {
  metadataUris: {
    // [5]: { collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/' },
    [137]: { collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/' }
  },
  contractAddresses: {
    // [5]: {
    //   collectionsManager: '0x9f4d9aC52C7356E00A4e9b732Dbd6377EcE19EE4',
    //   mergeManager: '0x0B397B88C96E22E63D6D9b802df62fe40bB1B544'
    // },
    [137]: {
      collectionsManager: '0x237B80e076cDfa4Dc4cC324B1a2f04F8E0513336',
      mergeManager: '0x0B397B88C96E22E63D6D9b802df62fe40bB1B544'
    }
  }
}

export { DEFAULT_PROPS as commonProps, DEFAULT_CONFIG_PROPS as contractProps }
