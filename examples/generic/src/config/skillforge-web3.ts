import { createWeb3ModalTheme } from '@past3lle/forge-web3'
import { Address } from '@past3lle/types'
import { PstlWeb3ModalProps } from '@past3lle/web3-modal'
import { goerli } from 'wagmi/chains'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const COLLECTIONS_MANAGER_ADDRESSES = require('../../forge-networks.json')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CONTRACTS_NETWORKS = require('@past3lle/skilltree-contracts/networks.json')

// TESTING ID - DONT USE IN PROD
const WALLETCONNECT_TEST_ID = 'a01e2f3b7c64ff495f9cb28e4e2d4b49'
const DEFAULT_PROPS: PstlWeb3ModalProps<5> = {
  appName: 'COSMOS APP',
  chains: [goerli],
  modals: {
    root: {
      themeConfig: {
        theme: createWeb3ModalTheme({
          DEFAULT: {
            modals: {
              base: {
                background: {
                  background: 'salmon'
                }
              }
            }
          }
        })
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
}

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP
export const CONTRACT_ADDRESSES_MAP = {
  [5]: {
    collectionsManager: COLLECTIONS_MANAGER_ADDRESSES[5].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[5].MergeManager.address as Address
  },
  [137]: {
    collectionsManager: COLLECTIONS_MANAGER_ADDRESSES[137].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[137].MergeManager.address as Address
  },
  [80001]: {
    collectionsManager: COLLECTIONS_MANAGER_ADDRESSES[80001].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[80001].MergeManager.address as Address
  }
} as const

const METADATA_URIS_MAP = {
  [5]: {
    collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/{id}.json'
  },
  [137]: {
    collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/{id}.json'
  }
}

const DEFAULT_CONFIG_PROPS = {
  metadataUris: METADATA_URIS_MAP,
  contractAddresses: CONTRACT_ADDRESSES_MAP
}

export { WALLETCONNECT_TEST_ID as wcId, DEFAULT_PROPS as commonProps, DEFAULT_CONFIG_PROPS as contractProps }
