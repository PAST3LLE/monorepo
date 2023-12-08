import { ButtonVariations, ColumnCenter, PstlButton, RowCenter, SpinnerCircle } from '@past3lle/components'
import { ThemeProvider, createCustomTheme } from '@past3lle/theme'
import { Address } from '@past3lle/types'
import { devWarn, getExpirementalCookieStore as getCookieStore } from '@past3lle/utils'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { parseEther } from 'viem'
import { goerli, polygon, polygonMumbai } from 'viem/chains'
import { mainnet, useBalance, useSendTransaction, useWaitForTransaction, useWatchPendingTransactions } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { infuraProvider } from 'wagmi/providers/infura'

import { RouterCtrl } from '../controllers'
import { RouterView } from '../controllers/types/controllerTypes'
import { useAccountNetworkActions, usePstlWeb3Modal, useUserConnectionInfo } from '../hooks'
import { useLimitChainsAndSwitchCallback } from '../hooks/useLimitChainsAndSwitchCallback'
import { useIsSafeApp, useIsSafeViaWc } from '../hooks/useWalletMetadata'
import { PstlWeb3ModalProps, PstlW3Providers as WalletModal } from '../providers'
import { addConnector } from '../providers/utils'
import { COMMON_CONNECTOR_OVERRIDES, DEFAULT_PROPS, DEFAULT_PROPS_WEB3AUTH, pstlModalTheme } from './config'
import { wagmiConnectors } from './connectorsAndPlugins'

const PstlW3Providers = ({ children, config }: { children: ReactNode; config: PstlWeb3ModalProps }) => (
  <WalletModal config={config}>{children}</WalletModal>
)

interface Web3ButtonProps {
  children?: ReactNode
}
const Web3Button = ({ children = <div>Show PSTL Wallet Modal</div> }: Web3ButtonProps) => {
  const { onAccountClick } = useAccountNetworkActions()
  const { address, connector } = useUserConnectionInfo()

  if (typeof globalThis?.window !== 'undefined' && !!connector && !(window as any)?.__PSTL_CONNECTOR) {
    ;(window as any).__PSTL_CONNECTOR = connector
  }

  return (
    <ColumnCenter>
      <PstlButton buttonVariant={ButtonVariations.PRIMARY} onClick={onAccountClick}>
        {children}
      </PstlButton>
      <h3>Connected to {address || 'DISCONNECTED!'}</h3>
      <h3>Connector: {connector?.id}</h3>
    </ColumnCenter>
  )
}

function DefaultApp() {
  const topLevelTheme = useTheme()

  if (!topLevelTheme) console.debug('No top level theme DefaultApp')

  return <InnerApp />
}

function InnerApp() {
  const { setMode, mode } = useTheme()
  const derivedConfig = Object.assign({}, DEFAULT_PROPS_WEB3AUTH)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  derivedConfig!.modals!.root!.themeConfig!.mode = mode
  return (
    <PstlW3Providers config={derivedConfig}>
      <AppWithWagmiAccess />
      <h1>MODE: {mode}</h1>
      <button onClick={() => setMode(mode === 'LIGHT' ? 'DARK' : 'LIGHT')}>Change theme mode</button>
      <button onClick={() => setMode('DEFAULT')}>Revert to default</button>
      <Web3Button />
    </PstlW3Providers>
  )
}

function AppWithWagmiAccess() {
  const isSafeWcConnector = useIsSafeViaWc()
  const isSafeApp = useIsSafeApp()

  const { address } = useUserConnectionInfo()
  const { data, refetch } = useBalance({ address })
  const [sendEthVal, setSendEthVal] = useState('0')
  const [addressToSendTo, setAddress] = useState('')

  const sendApi = useSendTransaction()

  const [txHash, setTxHash] = useState<Address | undefined>()
  const [txInProgress, setTxInProgress] = useState(false)

  const resetTxState = () => {
    setTxInProgress(false)
    setTxHash(undefined)
  }

  useWatchPendingTransactions({
    listener: (hashes) => {
      const hasHash = !!txHash && hashes.some((hash) => hash === txHash)
      if (hasHash) {
        resetTxState()
      }
    },
    enabled: !!txHash
  })

  const {
    isLoading: waitingForTx,
    isSuccess,
    isFetching,
    isRefetching
  } = useWaitForTransaction({
    hash: txHash,
    onReplaced(response) {
      console.debug('TX REPLACED! ==> ', response.reason, 'NEW HASH:', response.transaction.hash)
      setTxHash(response.transaction.hash)
    }
  })

  console.debug(`
    Wait for Tx ==>

    Is Safe WC?     ${isSafeWcConnector}
    Is Safe App?    ${isSafeApp}
    Waiting For Tx: ${waitingForTx}
    Is success:     ${isSuccess}
    Is Fetching:    ${isFetching}
    Is Refetching:  ${isRefetching}
  `)

  const handleSendTransaction = useCallback(
    async (args: { value: bigint; to: string }) => {
      setTxInProgress(true)
      sendApi
        .sendTransactionAsync(args)
        .then((tx) => setTxHash(tx.hash))
        .catch((error) => {
          resetTxState()
          throw error
        })
    },
    [sendApi]
  )

  const txLoading = txInProgress || waitingForTx

  return (
    <>
      <h1>Here has wagmi access</h1>
      <p>Address: {address}</p>
      <button onClick={() => refetch()}>Get balance</button>
      <p>Balance: {data?.formatted}</p>
      <br />

      <p>Send ETH</p>
      {txLoading ? (
        <>
          <h2>WAITING TRANSACTION...</h2>
          <h4>Hash: {txHash}</h4>
          <RowCenter width="300px">
            <SpinnerCircle filter="invert(1)" size={100} />
          </RowCenter>
        </>
      ) : (
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
      )}
    </>
  )
}

function Updater() {
  useEffect(() => {
    if (typeof globalThis?.window === 'undefined') return
    window.document.body.setAttribute('style', `font-family: system-ui;`)
  }, [])
  return null
}
const THEME = createCustomTheme({
  modes: {
    LIGHT: {
      header: 'white'
    },
    DARK: {
      header: 'black'
    },
    DEFAULT: {
      header: 'red'
    }
  }
})
const withThemeProvider = (Component: () => JSX.Element | null) => (
  <div style={{ fontFamily: 'system-ui' }}>
    <ThemeProvider theme={THEME}>
      <Updater />
      <Component />
    </ThemeProvider>
  </div>
)

export default {
  List__Web3Modal: withThemeProvider(() => <DefaultApp />),
  List__WalletConnectMetaMaskHidden: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES,
            hideInjectedFromRoot: true
          }
        }
      }}
    >
      <AppWithWagmiAccess />
      <Web3Button />
    </PstlW3Providers>
  )),
  List__WalletConnectUnknownInjected: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            connectorDisplayOverrides: undefined,
            hideInjectedFromRoot: false
          }
        }
      }}
    >
      <AppWithWagmiAccess />
      <Web3Button />
    </PstlW3Providers>
  )),
  List__LedgerLiveWalletConnect: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        connectors: [wagmiConnectors.ledgerLiveModal],
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            hideInjectedFromRoot: true,
            connectorDisplayOverrides: {
              ...COMMON_CONNECTOR_OVERRIDES,
              ledger: {
                customName: 'LEDGER LIVE',
                logo: 'https://crypto-central.io/library/uploads/Ledger-Logo-3.png',
                modalNodeId: 'ModalWrapper',
                rank: 10,
                isRecommended: true,
                infoText: {
                  title: 'What is Ledger?',
                  content: <strong>Ledger wallet is a cold storage hardware wallet.</strong>
                }
              }
            }
          }
        }
      }}
    >
      <AppWithWagmiAccess />
      <Web3Button />
    </PstlW3Providers>
  )),
  Grid__AllWithLedgerLive: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS_WEB3AUTH,
        connectors: [wagmiConnectors.ledgerLiveModal, wagmiConnectors.web3auth],
        modals: {
          ...DEFAULT_PROPS_WEB3AUTH.modals,
          root: {
            ...DEFAULT_PROPS_WEB3AUTH.modals.root,
            walletsView: 'grid',
            width: '640px',
            maxWidth: '100%',
            maxHeight: '550px',
            hideInjectedFromRoot: false,
            connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES
          }
        }
      }}
    >
      <AppWithWagmiAccess />
      <Web3Button />
    </PstlW3Providers>
  )),
  Grid__SizeDefaults: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        connectors: [wagmiConnectors.ledgerLiveModal, wagmiConnectors.ledgerHID],
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            walletsView: 'grid',
            hideInjectedFromRoot: false,
            connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES
          }
        }
      }}
    >
      <AppWithWagmiAccess />
      <Web3Button />
    </PstlW3Providers>
  )),
  List__SizeDefaults: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        connectors: [wagmiConnectors.ledgerLiveModal, wagmiConnectors.ledgerHID],
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            walletsView: 'list',
            connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES
          }
        }
      }}
    >
      <AppWithWagmiAccess />
      <Web3Button />
    </PstlW3Providers>
  )),
  List__MetaMaskFirstLedgerSecond: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        connectors: [
          wagmiConnectors.ledgerLiveModal
          // addConnector(InjectedConnector, {
          //   options: {
          //     name: 'Coinbase Wallet',
          //     getProvider() {
          //       if (typeof globalThis?.window === 'undefined') return undefined
          //       return window?.ethereum?.isCoinbaseWallet
          //         ? window.ethereum.providerMap?.get('CoinbaseWallet')
          //         : window?.coinbaseWalletExtension
          //     }
          //   }
          // })
        ],
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            walletsView: 'list',
            hideInjectedFromRoot: false,
            connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES,
            loaderProps: {
              containerProps: {
                borderRadius: '10px'
              },
              spinnerProps: {
                size: 80,
                filter: 'saturate(15) hue-rotate(100deg)'
              },
              loadingText: 'FETCHING INFO...'
            }
          }
        }
      }}
    >
      <AppWithWagmiAccess />
      <Web3Button />
    </PstlW3Providers>
  )),
  List__LedgerAutoClose: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        connectors: [wagmiConnectors.ledgerLiveModal],
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            closeModalOnConnect: true,
            walletsView: 'list',
            hideInjectedFromRoot: true,
            connectorDisplayOverrides: {
              ...COMMON_CONNECTOR_OVERRIDES,
              ledger: {
                customName: 'LEDGER LIVE',
                logo: 'https://crypto-central.io/library/uploads/Ledger-Logo-3.png',
                modalNodeId: 'ModalWrapper',
                rank: 10,
                isRecommended: true,
                infoText: {
                  title: 'What is Ledger?',
                  content: <strong>Ledger wallet is a cold storage hardware wallet.</strong>
                }
              }
            },
            loaderProps: {
              containerProps: {
                borderRadius: '10px'
              },
              spinnerProps: {
                size: 80,
                filter: 'saturate(15) hue-rotate(100deg)'
              },
              loadingText: 'FETCHING INFO...'
            }
          }
        }
      }}
    >
      <AppWithWagmiAccess />
      <Web3Button />
    </PstlW3Providers>
  )),
  Grid__LedgerHID: withThemeProvider(() => {
    return (
      <PstlW3Providers
        config={{
          ...DEFAULT_PROPS,
          connectors: [wagmiConnectors.ledgerHID, wagmiConnectors.ledgerLiveModal],
          modals: {
            ...DEFAULT_PROPS.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              closeModalOnConnect: true,
              walletsView: 'grid',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES,
              loaderProps: {
                fontSize: '3.2em',
                containerProps: {
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  filter: 'saturate(15) hue-rotate(100deg)'
                },
                loadingText: 'FETCHING INFO...'
              }
            }
          }
        }}
      >
        <AppWithWagmiAccess />
        <Web3Button />
      </PstlW3Providers>
    )
  }),
  Grid__ManyInjected: withThemeProvider(() => {
    return (
      <PstlW3Providers
        config={{
          ...DEFAULT_PROPS,
          chains: [DEFAULT_PROPS.chains[0]],
          connectors: [
            addConnector(InjectedConnector, {
              name: 'MetaMask',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Taho',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.tally
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Coinbase Wallet',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider =
                    (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            })
          ],
          modals: {
            ...DEFAULT_PROPS.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              closeModalOnConnect: true,
              walletsView: 'grid',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES,
              loaderProps: {
                fontSize: '3.2em',
                containerProps: {
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  filter: 'saturate(15) hue-rotate(100deg)'
                },
                loadingText: 'FETCHING INFO...'
              }
            }
          }
        }}
      >
        <AppWithWagmiAccess />
        <Web3Button />
      </PstlW3Providers>
    )
  }),
  Grid__ManyInjectedAndLedger: withThemeProvider(() => {
    return (
      <PstlW3Providers
        config={{
          ...DEFAULT_PROPS_WEB3AUTH,
          connectors: [
            wagmiConnectors.ledgerHID,
            wagmiConnectors.ledgerLiveModal,
            addConnector(InjectedConnector, {
              name: 'MetaMask',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Taho',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.tally
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Coinbase Wallet',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider =
                    (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            })
          ],
          modals: {
            ...DEFAULT_PROPS_WEB3AUTH.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              closeModalOnConnect: true,
              walletsView: 'grid',
              maxWidth: '650px',
              minHeight: '600px',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: {
                ...COMMON_CONNECTOR_OVERRIDES,
                'ledger-hid': {
                  ...COMMON_CONNECTOR_OVERRIDES['ledger-hid'],
                  async customConnect({ store, connector, wagmiConnect }) {
                    await wagmiConnect({ connector })
                    const id = connector?.id || connector?.name
                    id &&
                      store.updateModalConfig({
                        hidDeviceOptions: {
                          hidDeviceId: id
                        }
                      })
                    return store.ui.root.open({ route: 'HidDeviceOptions' })
                  }
                }
              },
              loaderProps: {
                fontSize: '3em',
                containerProps: {
                  borderRadius: '10px'
                },
                spinnerProps: {
                  filter: 'invert(1) saturate(0.8) hue-rotate(207deg) brightness(10)',
                  size: 90,
                  src: 'https://e7.pngegg.com/pngimages/599/45/png-clipart-computer-icons-loading-chart-hand-circle.png',
                  strokeWidth: 0.55
                },
                loadingText: 'FETCHING INFO...'
              }
            }
          }
        }}
      >
        <AppWithWagmiAccess />
        <Web3Button />
      </PstlW3Providers>
    )
  }),
  List__ManyInjectedAndLedger: withThemeProvider(() => {
    return (
      <PstlW3Providers
        config={{
          ...DEFAULT_PROPS_WEB3AUTH,
          connectors: [
            wagmiConnectors.ledgerHID,
            wagmiConnectors.ledgerLiveModal,
            addConnector(InjectedConnector, {
              name: 'MetaMask',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Taho',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.tally
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Coinbase Wallet',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider =
                    (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            })
          ],
          modals: {
            ...DEFAULT_PROPS_WEB3AUTH.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              closeModalOnConnect: true,
              walletsView: 'list',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: {
                ...COMMON_CONNECTOR_OVERRIDES,
                'ledger-hid': {
                  ...COMMON_CONNECTOR_OVERRIDES['ledger-hid'],
                  async customConnect({ store, connector, wagmiConnect }) {
                    await wagmiConnect({ connector })
                    const id = connector?.id || connector?.name
                    id &&
                      store.updateModalConfig({
                        hidDeviceOptions: {
                          hidDeviceId: id
                        }
                      })
                    return store.ui.root.open({ route: 'HidDeviceOptions' })
                  }
                }
              },
              loaderProps: {
                fontSize: '3.2em',
                containerProps: {
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  filter: 'saturate(15) hue-rotate(100deg)'
                },
                loadingText: 'FETCHING INFO...'
              }
            }
          }
        }}
      >
        <AppWithWagmiAccess />
        <Web3Button />
      </PstlW3Providers>
    )
  }),
  List__AutoSwitchChainFromURL: withThemeProvider(() => {
    return (
      <PstlW3Providers
        config={{
          ...DEFAULT_PROPS_WEB3AUTH,
          callbacks: {
            switchChain: async (chains) => {
              // IFrame so we need to do this
              const search = window?.top?.location.search
              const chainParam = Number(new URLSearchParams(search).get('cosmos-network') || 0)

              return chains.filter((chain) => chain.id === chainParam)[0]
            }
          },
          connectors: [
            wagmiConnectors.ledgerHID,
            wagmiConnectors.ledgerLiveModal,
            addConnector(InjectedConnector, {
              name: 'MetaMask',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Taho',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.tally
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Coinbase Wallet',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider =
                    (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            })
          ],
          modals: {
            ...DEFAULT_PROPS_WEB3AUTH.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              closeModalOnConnect: true,
              walletsView: 'list',
              // maxWidth: '650px',
              // minHeight: '600px',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES,

              loaderProps: {
                fontSize: '3.2em',
                containerProps: {
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  filter: 'saturate(15) hue-rotate(100deg)'
                },
                loadingText: 'FETCHING INFO...'
              }
            }
          }
        }}
      >
        <AppWithWagmiAccess />
        <Web3Button />
      </PstlW3Providers>
    )
  }),
  List__AutoSwitchChainFromCookies: withThemeProvider(() => {
    const COOKIE_KEY = 'cosmos-chain'
    const COOKIE_VALUE = '137'

    useEffect(() => {
      getCookieStore()
        ?.get(COOKIE_KEY)
        .then((cookie?: { value: string }) => {
          console.debug('COOKIE CURRENTLY SET', cookie)
          if (cookie?.value !== COOKIE_VALUE) {
            getCookieStore().set(COOKIE_KEY, COOKIE_VALUE)
            window.location.reload()
          }
        })
    }, [])

    return (
      <PstlW3Providers
        config={{
          ...DEFAULT_PROPS_WEB3AUTH,
          callbacks: {
            switchChain: async (chains) => {
              // IFrame so we need to do this
              const networkCookie = (await getCookieStore()?.get(COOKIE_KEY))?.value || 0

              return chains.find((chain) => chain.id === Number(networkCookie))
            }
          },
          connectors: [
            wagmiConnectors.ledgerHID,
            wagmiConnectors.ledgerLiveModal,
            addConnector(InjectedConnector, {
              name: 'MetaMask',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Taho',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.tally
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Coinbase Wallet',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider =
                    (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            })
          ],
          modals: {
            ...DEFAULT_PROPS_WEB3AUTH.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              closeModalOnConnect: true,
              walletsView: 'list',
              // maxWidth: '650px',
              // minHeight: '600px',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES,

              loaderProps: {
                fontSize: '3.2em',
                containerProps: {
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  filter: 'saturate(15) hue-rotate(100deg)'
                },
                loadingText: 'FETCHING INFO...'
              }
            }
          }
        }}
      >
        <AppWithWagmiAccess />
        <Web3Button />
      </PstlW3Providers>
    )
  }),
  Grid__ChainsFiltering: withThemeProvider(() => {
    const HARD_ENVIRONMENT_PARAM = 'hard-env'
    const SOFT_ENVIRONMENT_PARAM = 'soft-env'
    const limitChains = useLimitChainsAndSwitchCallback()
    return (
      <PstlW3Providers
        config={{
          ...DEFAULT_PROPS_WEB3AUTH,
          callbacks: {
            softLimitChains: (chains) => {
              const searchParams = new URLSearchParams(window?.top?.location.search)
              if (searchParams.get(SOFT_ENVIRONMENT_PARAM) === 'prod') {
                return [mainnet]
              } else if (searchParams.get(SOFT_ENVIRONMENT_PARAM) === 'dev') {
                return [mainnet, goerli, polygon]
              } else {
                return chains
              }
            },
            hardLimitChains: (chains) => {
              const searchParams = new URLSearchParams(window?.top?.location.search)
              if (searchParams.get(HARD_ENVIRONMENT_PARAM) === 'prod') {
                return [mainnet]
              } else if (searchParams.get(HARD_ENVIRONMENT_PARAM) === 'dev') {
                return [mainnet, goerli, polygon]
              } else {
                return chains
              }
            }
          },
          connectors: [
            wagmiConnectors.ledgerHID,
            wagmiConnectors.ledgerLiveModal,
            addConnector(InjectedConnector, {
              name: 'MetaMask',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Taho',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.tally
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Coinbase Wallet',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider =
                    (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            })
          ],
          modals: {
            ...DEFAULT_PROPS_WEB3AUTH.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              closeModalOnConnect: true,
              walletsView: 'grid',
              // maxWidth: '650px',
              // minHeight: '600px',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES,

              loaderProps: {
                fontSize: '3.2em',
                containerProps: {
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  filter: 'saturate(15) hue-rotate(100deg)'
                },
                loadingText: 'FETCHING INFO...'
              }
            }
          },
          clients: {
            wagmi: {
              options: {
                ...DEFAULT_PROPS_WEB3AUTH.clients?.wagmi?.options,
                publicClients: process.env.REACT_APP_INFURA_ID
                  ? [infuraProvider({ apiKey: process.env.REACT_APP_INFURA_ID })]
                  : []
              }
            }
          }
        }}
      >
        <AppWithWagmiAccess />
        <Web3Button />
        <button onClick={() => limitChains([mainnet])}>Limit chains to just MAINNET</button>
        <button onClick={() => limitChains([goerli])}>Limit chains to just GOERLI</button>
        <button onClick={() => limitChains([polygonMumbai])}>Limit chains to just MUMMBAI</button>
      </PstlW3Providers>
    )
  }),
  Grid__CloseOnEscapeKey: withThemeProvider(() => {
    const { mode, setMode } = useTheme()
    return (
      <PstlW3Providers
        config={{
          ...DEFAULT_PROPS_WEB3AUTH,
          options: {
            ...DEFAULT_PROPS_WEB3AUTH.options,
            closeModalOnKeys: ['Escape', 'Esc']
          },
          connectors: [
            wagmiConnectors.ledgerHID,
            wagmiConnectors.ledgerLiveModal,
            addConnector(InjectedConnector, {
              name: 'MetaMask',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider =
                    window?.ethereum?.providers?.find((provider) => provider?.isMetaMask) ||
                    (window.ethereum?.isMetaMask && window.ethereum)
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Taho',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.tally
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Coinbase Wallet',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider =
                    (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            })
          ],
          modals: {
            ...DEFAULT_PROPS_WEB3AUTH.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              themeConfig: {
                theme: pstlModalTheme,
                mode
              },
              closeModalOnConnect: true,
              openType: 'root',
              walletsView: 'grid',
              maxWidth: '650px',
              minHeight: '600px',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES,
              loaderProps: {
                fontSize: '3.2em',
                containerProps: {
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  filter: 'saturate(15) hue-rotate(100deg)'
                },
                loadingText: 'FETCHING INFO...'
              }
            }
          }
        }}
      >
        <AppWithWagmiAccess />
        <Web3Button />
        Theme: {mode}
        <button onClick={() => setMode(mode === 'LIGHT' ? 'DARK' : 'LIGHT')}>Change theme mode</button>
        <button onClick={() => setMode('DEFAULT')}>Revert to default</button>
      </PstlW3Providers>
    )
  }),
  Grid__LedgerDeviceConfigChoice: withThemeProvider(() => {
    return (
      <PstlW3Providers
        config={{
          ...DEFAULT_PROPS_WEB3AUTH,
          connectors: [wagmiConnectors.ledgerHID, wagmiConnectors.ledgerLiveModal],
          modals: {
            ...DEFAULT_PROPS_WEB3AUTH.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              closeModalOnConnect: true,
              walletsView: 'grid',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: {
                ...COMMON_CONNECTOR_OVERRIDES,
                'ledger-hid': {
                  ...COMMON_CONNECTOR_OVERRIDES['ledger-hid'],
                  async customConnect({ store, connector, wagmiConnect }) {
                    await wagmiConnect({ connector })
                    const id = connector?.id || connector?.name
                    id &&
                      store.updateModalConfig({
                        hidDeviceOptions: {
                          hidDeviceId: id
                        }
                      })
                    return store.ui.root.open({ route: 'ConnectorConfigType' })
                  }
                }
              },
              loaderProps: {
                fontSize: '3.2em',
                containerProps: {
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  filter: 'saturate(15) hue-rotate(100deg)'
                },
                loadingText: 'FETCHING INFO...'
              }
            }
          }
        }}
      >
        <AppWithWagmiAccess />
        <Web3Button />
      </PstlW3Providers>
    )
  }),
  HIDDeviceModal: withThemeProvider(() => {
    return (
      <PstlW3Providers
        config={{
          ...DEFAULT_PROPS_WEB3AUTH,
          connectors: [
            wagmiConnectors.ledgerHID,
            wagmiConnectors.ledgerLiveModal,
            addConnector(InjectedConnector, {
              name: 'MetaMask',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Taho',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.tally
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Coinbase Wallet',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider =
                    (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            })
          ],
          modals: {
            ...DEFAULT_PROPS_WEB3AUTH.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              closeModalOnConnect: true,
              walletsView: 'grid',
              maxWidth: '650px',
              minHeight: '600px',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: {
                ...COMMON_CONNECTOR_OVERRIDES,
                'ledger-hid': {
                  ...COMMON_CONNECTOR_OVERRIDES['ledger-hid'],
                  async customConnect({ store, connector, wagmiConnect }) {
                    await wagmiConnect({ connector })
                    const id = connector?.id || connector?.name
                    id &&
                      store.updateModalConfig({
                        hidDeviceOptions: {
                          hidDeviceId: id
                        }
                      })
                    return store.ui.root.open({ route: 'HidDeviceOptions' })
                  }
                }
              },
              loaderProps: {
                fontSize: '3.2em',
                containerProps: {
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  filter: 'saturate(15) hue-rotate(100deg)'
                },
                loadingText: 'FETCHING INFO...'
              }
            }
          }
        }}
      >
        <AppWithWagmiAccess />
        <ModalOpenButton />
      </PstlW3Providers>
    )
  }),
  HIDConfigChoiceModal: withThemeProvider(() => {
    return (
      <PstlW3Providers
        config={{
          ...DEFAULT_PROPS_WEB3AUTH,
          connectors: [
            wagmiConnectors.ledgerHID,
            wagmiConnectors.ledgerLiveModal,
            addConnector(InjectedConnector, {
              name: 'MetaMask',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Taho',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider = window?.tally
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            }),
            addConnector(InjectedConnector, {
              name: 'Coinbase Wallet',
              shimDisconnect: true,
              getProvider() {
                if (typeof globalThis?.window === 'undefined') return undefined
                try {
                  const provider =
                    (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                  if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                  return provider
                } catch (error) {
                  return undefined
                }
              }
            })
          ],
          modals: {
            ...DEFAULT_PROPS_WEB3AUTH.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              closeModalOnConnect: true,
              walletsView: 'grid',
              maxWidth: '650px',
              minHeight: '600px',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: {
                ...COMMON_CONNECTOR_OVERRIDES,
                'ledger-hid': {
                  ...COMMON_CONNECTOR_OVERRIDES['ledger-hid'],
                  async customConnect({ store, connector, wagmiConnect }) {
                    await wagmiConnect({ connector })
                    const id = connector?.id || connector?.name
                    id &&
                      store.updateModalConfig({
                        hidDeviceOptions: {
                          hidDeviceId: id
                        }
                      })
                    return store.ui.root.open({ route: 'HidDeviceOptions' })
                  }
                }
              },
              loaderProps: {
                fontSize: '3.2em',
                containerProps: {
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  filter: 'saturate(15) hue-rotate(100deg)'
                },
                loadingText: 'FETCHING INFO...'
              }
            }
          }
        }}
      >
        <AppWithWagmiAccess />
        <ModalOpenButton view="ConnectorConfigType" />
      </PstlW3Providers>
    )
  })
}

function ModalOpenButton({ view = 'HidDeviceOptions' }: { view?: RouterView }) {
  const { open } = usePstlWeb3Modal()
  const { address, connector } = useUserConnectionInfo()

  return (
    <ColumnCenter>
      <PstlButton
        buttonVariant={ButtonVariations.PRIMARY}
        onClick={() => {
          open()
          RouterCtrl.push(view)
        }}
      >
        Open HID Device modal
      </PstlButton>
      <h3>Connected to {address || 'DISCONNECTED!'}</h3>
      <h3>Connector: {connector?.id}</h3>
    </ColumnCenter>
  )
}
