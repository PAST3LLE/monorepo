import { RowCenter, SpinnerCircle } from '@past3lle/components'
import { useAddPendingTransaction } from '@past3lle/web3-modal'
import { Web3Button } from '@web3modal/react'
import React, { useCallback, useState } from 'react'
import { parseEther } from 'viem'
import { useBalance, useSendTransaction } from 'wagmi'

import { ForgeW3Providers, useW3Modal, useW3UserConnectionInfo } from '..'
import { THEME, commonProps, contractProps } from './config'

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
  const { address } = useW3UserConnectionInfo()

  // const lockedSkillData = useForgeUnpreparedClaimLockedSkill({
  //   token: '0x1b18aC6D5371FeD52521964145E2c8aAF7571a88',
  //   id: BigInt(3000)
  // })
  const { data, refetch } = useBalance({ address })
  const [sendEthVal, setSendEthVal] = useState('0')
  const [addressToSendTo, setAddress] = useState('')

  const sendApi = useSendTransaction()

  const addPendingTransaction = useAddPendingTransaction()

  const [currentTx, setTx] = useState('')
  const handleSendTransaction = useCallback(
    async (args: { value: bigint; to: string }) => {
      setTx('pending')
      sendApi
        .sendTransactionAsync(args)
        .then((tx) => {
          setTx(tx.hash)
          addPendingTransaction(tx.hash)
        })
        .catch((error) => {
          throw error
        })
        .finally(() => {
          setTx('')
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sendApi]
  )

  return (
    <>
      {/* @ts-ignore */}
      <button onClick={open}>Open W3 Modal</button>
      <h1>Here has wagmi access</h1>
      <p>Address: {address}</p>
      <button onClick={() => refetch()}>Get balance</button>
      <p>Balance: {data?.formatted}</p>
      <br />

      <p>Send ETH</p>
      <>
        {!!currentTx && status !== 'success' && (
          <RowCenter width="300px" gap="1rem">
            <h4>TX {currentTx} in progress...</h4>
            <SpinnerCircle filter="invert(1)" size={100} />
          </RowCenter>
        )}
      </>

      <>
        <p>
          Amount
          <input type="text" value={sendEthVal} onChange={(e: any) => setSendEthVal(e.target.value)} />
        </p>
        <p>
          To
          <input type="text" value={addressToSendTo} onChange={(e: any) => setAddress(e.target.value)} />
        </p>
        <button onClick={() => handleSendTransaction({ value: parseEther(sendEthVal), to: addressToSendTo })}>
          Send to {addressToSendTo || 'N/A'}
        </button>
      </>
    </>
  )
}

function App() {
  return (
    <ForgeW3Providers
      config={{
        ...contractProps,
        contactInfo: {
          email: 'some-fake-email@gmail.com'
        },
        contentUrls: {
          FAQ: 'https://faq.learnmoreabout.stuff.net'
        },
        name: commonProps.appName,
        web3: {
          connectors: {
            overrides: {
              walletconnect: {
                async customConnect({ store }) {
                  return store.walletConnect.open()
                }
              }
            }
          },
          chains: commonProps.chains,
          modals: {
            root: {
              themeConfig: { theme: THEME }
            },
            walletConnect: commonProps.modals.walletConnect
          },
          options: {
            escapeHatches: {
              appType: 'DAPP'
            }
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
        contactInfo: {
          email: 'some-fake-email@gmail.com'
        },
        contentUrls: {
          FAQ: 'https://faq.learnmoreabout.stuff.net'
        },
        name: commonProps.appName,
        web3: {
          chains: commonProps.chains,
          modals: {
            walletConnect: commonProps.modals.walletConnect
          },
          options: {
            escapeHatches: {
              appType: 'DAPP'
            }
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
        contactInfo: {
          email: 'some-fake-email@gmail.com'
        },
        contentUrls: {
          FAQ: 'https://faq.learnmoreabout.stuff.net'
        },
        name: commonProps.appName,
        web3: {
          chains: commonProps.chains,
          modals: {
            walletConnect: commonProps.modals.walletConnect
          },
          options: {
            escapeHatches: {
              appType: 'DAPP'
            }
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
