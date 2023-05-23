import { Web3Button } from '@web3modal/react'
import React from 'react'

import { ForgeW3Providers, useW3Connection, useW3Modal } from '..'
import { commonProps, contractProps } from './config'

/* 
    interface Web3ModalProps {
        appName: string
        web3Modal: Web3ModalConfig
        wagmiClient?: SkillForgeW3WagmiClientOptions
        ethereumClient?: EthereumClient
    }
*/

function InnerApp() {
  const { open } = useW3Modal()
  const [, , { address }] = useW3Connection()

  return (
    <div>
      <button onClick={() => open({ route: address ? 'Account' : 'ConnectWallet' }) as any}>
        Open Pstl Web3 Modal
      </button>
      <h1>{address || 'Disconnected'}</h1>
    </div>
  )
}

function App() {
  return (
    <ForgeW3Providers
      config={{
        ...contractProps,
        name: commonProps.appName,
        web3: {
          chains: commonProps.chains,
          modals: {
            w3m: commonProps.modals.w3m,
            w3a: commonProps.modals.w3a
          }
        }
      }}
    >
      <InnerApp />
    </ForgeW3Providers>
  )
}

export default {
  default: (
    <ForgeW3Providers
      config={{
        ...contractProps,
        name: commonProps.appName,
        web3: {
          chains: commonProps.chains,
          modals: {
            w3m: commonProps.modals.w3m,
            w3a: commonProps.modals.w3a
          }
        }
      }}
    >
      <h1>Default Web3Modal selections</h1>
      <Web3Button label="Click and select a wallet in the modal!" />
    </ForgeW3Providers>
  ),
  web3Auth: (
    <ForgeW3Providers
      config={{
        ...contractProps,
        name: commonProps.appName,
        web3: {
          chains: commonProps.chains,
          modals: {
            w3m: commonProps.modals.w3m,
            w3a: commonProps.modals.w3a
          }
        }
      }}
    >
      <h1>Web3Auth in the Web3Modal</h1>
      <Web3Button label="Click and try selecting Web3Auth in the modal!" />
    </ForgeW3Providers>
  ),
  app: <App />
}
