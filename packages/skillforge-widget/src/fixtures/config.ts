import { ForgeW3CoreProvidersProps } from '@past3lle/forge-web3'
import { goerli } from 'wagmi/chains'

const DEFAULT_PROPS: ForgeW3CoreProvidersProps['config']['web3'] = {
  chains: [goerli],
  modals: {
    walletConnect: {
      projectId: process.env.REACT_APP_WEB3MODAL_ID || '',
      walletImages: {
        web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
        safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
      }
    },
    web3auth: {
      appName: 'SKILLFORGE TEST',
      projectId: process.env.REACT_APP_WEB3_AUTH_ID || '',
      network: 'cyan'
    }
  }
}
const DEFAULT_CONFIG_PROPS: Pick<ForgeW3CoreProvidersProps['config'], 'contractAddresses' | 'metadataUris'> = {
  metadataUris: {
    [5]: { collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/' }
  },
  contractAddresses: {
    [5]: {
      collectionsManager: '0x9f4d9aC52C7356E00A4e9b732Dbd6377EcE19EE4',
      mergeManager: '0x0B397B88C96E22E63D6D9b802df62fe40bB1B544'
    }
  }
}

export { DEFAULT_PROPS as commonProps, DEFAULT_CONFIG_PROPS as contractProps }
