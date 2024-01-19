import { RowCenter, SpinnerCircle } from '@past3lle/components'
import { useAddPendingTransaction, usePendingTransactions, usePstlWeb3Modal } from '@past3lle/web3-modal'
import React, { useCallback, useState } from 'react'
import { Address, parseEther } from 'viem'
import { Config, ProviderNotFoundError, useBalance, useSendTransaction } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { SendTransactionMutateAsync } from 'wagmi/query'

import { ForgeW3Providers, useW3Modal, useW3UserConnectionInfo } from '..'
import { THEME, commonProps, contractProps } from './config'

const IS_SERVER = typeof globalThis?.window === 'undefined'

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
  const { address, chainId, connector } = useW3UserConnectionInfo()

  const { data, refetch } = useBalance({ address })
  const [sendEthVal, setSendEthVal] = useState('0')
  const [addressToSendTo, setAddress] = useState<Address | undefined>()

  const sendApi = useSendTransaction()

  const pendingTransactions = usePendingTransactions()
  const addPendingTransaction = useAddPendingTransaction()

  const [currentTx, setTx] = useState('')
  const handleSendTransaction = useCallback(
    async (args: Parameters<SendTransactionMutateAsync<Config>>[0]) => {
      setTx('pending')
      sendApi
        .sendTransactionAsync(args)
        .then((hash) => {
          setTx(hash)
          addPendingTransaction(hash)
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
        <button
          onClick={() =>
            addressToSendTo && handleSendTransaction({ value: parseEther(sendEthVal), to: addressToSendTo })
          }
        >
          Send to {addressToSendTo || 'N/A'}
        </button>
        <br />
        <br />
        {pendingTransactions.map((tx) => (
          <p>{tx.safeTxHash || tx.transactionHash}</p>
        ))}
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
                async customConnect({ modalsStore }) {
                  return modalsStore.open()
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
  default: () => (
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
          connectors: {
            connectors: [
              injected({
                shimDisconnect: true,
                target() {
                  try {
                    if (IS_SERVER) throw new Error('Injected providers not available in server context.')
                    return {
                      name: 'MetaMask',
                      id: 'io.metamask',
                      icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
                      provider() {
                        const provider = window.ethereum?.isMetaMask
                          ? window.ethereum
                          : window.ethereum?.providersMap?.get('metamask')
                        if (!provider) throw new ProviderNotFoundError()
                        return provider
                      }
                    }
                  } catch (error) {
                    alert('MetaMask injected provider not found on window!')
                    return undefined
                  }
                }
              })
            ]
          },
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
      <h1>DEFAULT</h1>
      <InnerApp />
    </ForgeW3Providers>
  ),
  app: <App />
}
