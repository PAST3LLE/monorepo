import { ForgeChainsMinimum, ForgeContractAddressMap, ForgeMetadataUriMap } from '@past3lle/forge-web3'
import { ForgeW3CoreProvidersProps, createWeb3ModalTheme } from '@past3lle/forge-web3'
import { devDebug } from '@past3lle/utils'
import { ledgerHid } from '@past3lle/wagmi-connectors'
import { Chain, goerli, polygon } from 'viem/chains'
import { ConnectorNotFoundError } from 'wagmi'

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
      transactions: {
        baseFontSize: 20
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
            background: 'navajowhite'
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
// TESTING ID - DONT USE IN PROD
const WALLETCONNECT_TEST_ID = 'a01e2f3b7c64ff495f9cb28e4e2d4b49'
const SUPPORTED_CHAINS = [goerli as any, polygon] as const satisfies ForgeChainsMinimum
const WEB3_PROPS: ForgeW3CoreProvidersProps<typeof SUPPORTED_CHAINS>['config']['web3'] = {
  chains: SUPPORTED_CHAINS,
  connectors: {
    connectors: [ledgerHid()],
    overrides: {
      'ledger-hid': {
        customName: 'Ledger HID Device',
        async customConnect({ modalsStore, connector, wagmiConnect }) {
          if (!connector) throw new ConnectorNotFoundError()
          await wagmiConnect(connector)
          modalsStore.open({ route: 'HidDeviceOptions' })
        }
      }
    }
  },
  callbacks: {
    transactions: {
      onEoaTransactionConfirmed(tx) {
        devDebug('[@past3lle/skillforge-widget] EOA transaction confirmed!', tx)
        return tx
      },
      onEoaTransactionUnknown(tx) {
        devDebug('[@past3lle/skillforge-widget] EOA transaction Unknown!', tx)
        return tx
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
      projectId: WALLETCONNECT_TEST_ID,
      walletImages: {
        web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
        safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
      }
    }
  }
} as const satisfies ForgeW3CoreProvidersProps<typeof SUPPORTED_CHAINS>['config']['web3']

const METADATA_URIS_AND_CONTRACTS_PROPS = {
  metadataUris: {
    [5]: { collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/' },
    [137]: { collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/' }
  },
  contractAddresses: {
    [5]: {
      collectionsManager: '0x00ad95f9D3E5Af8707700520FF3c45964Ef20423',
      mergeManager: '0x03b5d78E489b2bdF57Be8b1e2c0A5fFF369b030F'
    },
    [137]: {
      collectionsManager: '0x237B80e076cDfa4Dc4cC324B1a2f04F8E0513336',
      mergeManager: '0x0B397B88C96E22E63D6D9b802df62fe40bB1B544'
    }
  }
} as const satisfies {
  metadataUris: ForgeMetadataUriMap<typeof SUPPORTED_CHAINS>
  contractAddresses: ForgeContractAddressMap<typeof SUPPORTED_CHAINS>
}

export { SUPPORTED_CHAINS, WEB3_PROPS, METADATA_URIS_AND_CONTRACTS_PROPS }
