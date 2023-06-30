import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'

import { ForgeContractAddressMap } from '../types'
import { ForgeWeb3ModalProps } from '../types/web3modal'
import { chains } from './chains'

// TESTING ID - DONT USE IN PROD
const WALLETCONNECT_TEST_ID = 'a01e2f3b7c64ff495f9cb28e4e2d4b49'
// TESTING KEY DO NOT USE IN PROD
const WEB3AUTH_TEST_ID = 'BHloyoLW113nGn-mIfeeNqj2U0wNCXa4y83xLnR6d3FELPMz_oZ7rbY4ZEO3r0MVjQ_LX92obu1ta0NknOwfvtU'
const DEFAULT_PROPS: ForgeWeb3ModalProps = {
  appName: 'COSMOS APP',
  chains,
  modals: {
    walletConnect: {
      projectId: WALLETCONNECT_TEST_ID,
      walletImages: {
        web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
        safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
      }
    },
    web3auth: {
      appName: 'SKILLFORGE TEST',
      projectId: WEB3AUTH_TEST_ID,
      network: 'cyan',
      storageKey: 'session',
      preset: 'DISALLOW_EXTERNAL_WALLETS',
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
                  torusBrand1: '#ffc0cb',
                  torusBrand2: '#ffc0cb'
                }
              },
              logoDark: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
              logoLight: 'https://web3auth.io/images/w3a-L-Favicon-1.svg'
            },
            useWalletConnect: true
          }
        })

        return [torusPlugin]
      }
    }
  }
}
const DEFAULT_CONFIG_PROPS = {
  metadataUris: {
    [5]: { collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/' },
    [80001]: { collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/' }
  },
  contractAddresses: {
    [5]: {
      collectionsManager: '0x9f4d9aC52C7356E00A4e9b732Dbd6377EcE19EE4',
      mergeManager: '0x0B397B88C96E22E63D6D9b802df62fe40bB1B544'
    },
    // TODO: change to mumbai addresses
    [80001]: {
      collectionsManager: '0xbb76e8eeBe675787B1056A8418733F13967Be209',
      mergeManager: '0x0B397B88C96E22E63D6D9b802df62fe40bB1B544'
    }
  } as ForgeContractAddressMap
}

export { WALLETCONNECT_TEST_ID as wcId, DEFAULT_PROPS as commonProps, DEFAULT_CONFIG_PROPS as contractProps }
