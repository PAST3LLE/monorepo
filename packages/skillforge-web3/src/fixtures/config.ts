import { PstlW3ProviderProps } from '@past3lle/web3-modal'

import { chains } from '../connectors/config'
import { SkillForgeContractAddressMap, SkillForgeMetadataUriMap } from '../types'

// TESTING ID - DONT USE IN PROD
const WALLETCONNECT_TEST_ID = 'a01e2f3b7c64ff495f9cb28e4e2d4b49'
// TESTING KEY DO NOT USE IN PROD
const WEB3AUTH_TEST_ID = 'BHloyoLW113nGn-mIfeeNqj2U0wNCXa4y83xLnR6d3FELPMz_oZ7rbY4ZEO3r0MVjQ_LX92obu1ta0NknOwfvtU'
const DEFAULT_PROPS: PstlW3ProviderProps = {
  appName: 'COSMOS APP',
  chains,
  modals: {
    w3m: {
      w3mId: WALLETCONNECT_TEST_ID,
      walletImages: {
        web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
        safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
      }
    },
    w3a: {
      appName: 'SKILLFORGE TEST',
      w3aId: WEB3AUTH_TEST_ID,
      network: 'mainnet'
    }
  }
}
const DEFAULT_CONFIG_PROPS = {
  metadataUris: {
    [5]: { collections: 'www.google.com', skills: [{ id: 1, uri: 'ipfs://skills.io' }] },
    [80001]: { collections: 'www.google.com', skills: [{ id: 1, uri: 'ipfs://skills.io' }] }
  } as SkillForgeMetadataUriMap,
  contractAddresses: {
    [5]: {
      collections: '0x25CeF6E76b7b9C7387414bE6245AEd7846Fe74c3',
      skills: [{ id: 1, address: '0x25CeF6E76b7b9C7387414bE6245AEd7846Fe74c3' }]
    },
    [80001]: {
      collections: '0x25CeF6E76b7b9C7387414bE6245AEd7846Fe74c3',
      skills: [{ id: 1, address: '0x25CeF6E76b7b9C7387414bE6245AEd7846Fe74c3' }]
    }
  } as SkillForgeContractAddressMap
}

export { WALLETCONNECT_TEST_ID as wcId, DEFAULT_PROPS as commonProps, DEFAULT_CONFIG_PROPS as contractProps }
