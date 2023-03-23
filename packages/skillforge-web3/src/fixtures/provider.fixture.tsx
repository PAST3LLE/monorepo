import { Web3Button } from '@web3modal/react'
import React from 'react'
import { goerli, polygonMumbai } from 'wagmi/chains'

import { ForgeW3ConnectedProviders } from '../components'
// import { SkillForgeW3Providers } from '../providers'
import { Web3ModalProps } from '../providers/types'
import Web3AuthConnectorInstance from './connectors/web3auth'

const chains = [goerli, polygonMumbai]

/* 
    interface Web3ModalProps {
        appName: string
        web3Modal: Web3ModalConfig
        wagmiClient?: SkillForgeW3WagmiClientOptions
        ethereumClient?: EthereumClient
    }
*/

// TESTING ID - DONT USE IN PROD
const WALLETCONNECT_TEST_ID = 'a01e2f3b7c64ff495f9cb28e4e2d4b49'
const DEFAULT_PROPS: Web3ModalProps = {
  appName: 'COSMOS APP',
  web3Modal: {
    projectId: WALLETCONNECT_TEST_ID,
    chains,
    // desktopWallets: [{ id: 'web3auth', name: 'email', links: { universal: '123', native: '123' } }],
    walletImages: {
      web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
      safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
    }
  }
}

export default {
  default: (
    <ForgeW3ConnectedProviders
      config={{
        name: DEFAULT_PROPS.appName,
        web3: {
          web3Modal: DEFAULT_PROPS.web3Modal
        },
        metadataUris: {
          [5]: { collections: 'www.google.com', skills: [{ id: 1, uri: 'ipfs://skills.io' }] },
          [80001]: { collections: 'www.google.com', skills: [{ id: 1, uri: 'ipfs://skills.io' }] }
        },
        contractAddresses: {
          [5]: { collections: '0x123', skills: [{ id: 1, address: '0x123' }] },
          [80001]: { collections: '0x123', skills: [{ id: 1, address: '0x123' }] }
        }
      }}
    >
      <h1>Default Web3Modal selections</h1>
      <Web3Button label="Click and select a wallet in the modal!" />
    </ForgeW3ConnectedProviders>
  ),
  web3Auth: (
    <ForgeW3ConnectedProviders
      config={{
        name: DEFAULT_PROPS.appName,
        web3: {
          web3Modal: DEFAULT_PROPS.web3Modal,
          wagmiClient: {
            ...DEFAULT_PROPS.wagmiClient,
            options: {
              connectors: [Web3AuthConnectorInstance(chains)]
            }
          },
          ethereumClient: DEFAULT_PROPS.ethereumClient
        },
        metadataUris: {
          [5]: { collections: 'www.google.com', skills: [{ id: 1, uri: 'ipfs://skills.io' }] },
          [80001]: { collections: 'www.google.com', skills: [{ id: 1, uri: 'ipfs://skills.io' }] }
        },
        contractAddresses: {
          [5]: { collections: '0x123', skills: [{ id: 1, address: '0x123' }] },
          [80001]: { collections: '0x123', skills: [{ id: 1, address: '0x123' }] }
        }
      }}
    >
      <h1>Web3Auth in the Web3Modal</h1>
      <Web3Button label="Click and try selecting Web3Auth in the modal!" />
    </ForgeW3ConnectedProviders>
  )
}
