import { Web3Button } from '@web3modal/react'
import React from 'react'

import { ForgeW3ConnectedProviders } from '..'
import { commonProps, contractProps } from './config'

/* 
    interface Web3ModalProps {
        appName: string
        web3Modal: Web3ModalConfig
        wagmiClient?: SkillForgeW3WagmiClientOptions
        ethereumClient?: EthereumClient
    }
*/
export default {
  default: (
    <ForgeW3ConnectedProviders
      config={{
        ...contractProps,
        name: commonProps.appName,
        web3: {
          web3Modal: commonProps.web3Modal,
          web3Auth: commonProps.web3Auth
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
        ...contractProps,
        name: commonProps.appName,
        web3: {
          web3Modal: commonProps.web3Modal,
          web3Auth: commonProps.web3Auth,
          wagmiClient: {
            ...commonProps.wagmiClient
          },
          ethereumClient: commonProps.ethereumClient
        }
      }}
    >
      <h1>Web3Auth in the Web3Modal</h1>
      <Web3Button label="Click and try selecting Web3Auth in the modal!" />
    </ForgeW3ConnectedProviders>
  )
}
