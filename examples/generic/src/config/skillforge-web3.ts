import {
  CONTRACTS_NETWORKS,
  SkillForgeContractAddressMap,
  SkillForgeMetadataUriMap,
  SupportedChains
} from '@past3lle/forge-web3'
import { Address } from '@past3lle/types'
import { PstlWeb3ModalProps } from '@past3lle/web3-modal'
import { goerli } from 'wagmi/chains'

// TESTING ID - DONT USE IN PROD
const WALLETCONNECT_TEST_ID = 'a01e2f3b7c64ff495f9cb28e4e2d4b49'
// TESTING KEY DO NOT USE IN PROD
const WEB3AUTH_TEST_ID = 'BHloyoLW113nGn-mIfeeNqj2U0wNCXa4y83xLnR6d3FELPMz_oZ7rbY4ZEO3r0MVjQ_LX92obu1ta0NknOwfvtU'
const DEFAULT_PROPS: PstlWeb3ModalProps<5> = {
  appName: 'COSMOS APP',
  chains: [goerli],
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
      network: 'mainnet'
    }
  }
}

const CONTRACT_ADDRESSES_MAP: SkillForgeContractAddressMap = {
  [SupportedChains.GOERLI]: {
    collectionsManager: CONTRACTS_NETWORKS[SupportedChains.GOERLI].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[SupportedChains.GOERLI].UnlockManager.address as Address
  },
  // TODO: fix - use proper mumbai addreses
  [SupportedChains.POLYGON_MAINNET]: {
    collectionsManager: CONTRACTS_NETWORKS[SupportedChains.POLYGON_MAINNET].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[SupportedChains.POLYGON_MAINNET].UnlockManager.address as Address
  }
}

const METADATA_URIS_MAP: SkillForgeMetadataUriMap = {
  [SupportedChains.GOERLI]: {
    collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/{id}.json'
  },
  [SupportedChains.POLYGON_MAINNET]: {
    collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/{id}.json'
  }
}

const DEFAULT_CONFIG_PROPS = {
  metadataUris: METADATA_URIS_MAP,
  contractAddresses: CONTRACT_ADDRESSES_MAP
}

export { WALLETCONNECT_TEST_ID as wcId, DEFAULT_PROPS as commonProps, DEFAULT_CONFIG_PROPS as contractProps }
