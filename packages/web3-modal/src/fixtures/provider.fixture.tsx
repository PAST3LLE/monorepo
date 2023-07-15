import { ButtonVariations, ColumnCenter, PstlButton } from '@past3lle/components'
import { WindowSizeProvider } from '@past3lle/hooks'
import { ThemeProvider, createCustomTheme } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import React, { ReactNode } from 'react'
import { useTheme } from 'styled-components'
import { useBalance } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

import { useUserConnectionInfo, useWeb3Modals } from '../hooks'
import { PstlWeb3ModalProps, PstlW3Providers as WalletModal } from '../providers'
import { addConnector } from '../providers/utils'
import { COMMON_CONNECTOR_OVERRIDES, DEFAULT_PROPS, DEFAULT_PROPS_WEB3AUTH } from './config'
import { w3aPlugins, wagmiConnectors } from './connectorsAndPlugins'

const PstlW3Providers = ({ children, config }: { children: ReactNode; config: PstlWeb3ModalProps<number> }) => (
  <WindowSizeProvider>
    <WalletModal config={config}>{children}</WalletModal>
  </WindowSizeProvider>
)

interface Web3ButtonProps {
  children?: ReactNode
}
const Web3Button = ({ children = <div>Show PSTL Wallet Modal</div> }: Web3ButtonProps) => {
  const { root } = useWeb3Modals()
  const { address, connector } = useUserConnectionInfo()

  return (
    <ColumnCenter>
      <PstlButton
        buttonVariant={ButtonVariations.PRIMARY}
        onClick={() => (address ? root.open({ route: 'Account' }) : root.open({ route: 'ConnectWallet' }))}
      >
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
  // @ts-expect-error - readonly
  derivedConfig.modals['web3auth'].configureAdditionalConnectors = function configureAdditionalConnectors() {
    return [w3aPlugins.torusPlugin]
  }

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
  const { address } = useUserConnectionInfo()
  const { data, refetch } = useBalance({ address })

  return (
    <>
      <h1>Here has wagmi access</h1>
      <p>Address: {address}</p>
      <button onClick={() => refetch()}>Get balance</button>
      <p>Balance: {data?.formatted}</p>
    </>
  )
}

const withThemeProvider = (Component: () => JSX.Element | null) => (
  <ThemeProvider
    theme={createCustomTheme({
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
    })}
  >
    <Component />
  </ThemeProvider>
)

export default {
  List__Web3ModalWeb3AuthAndTorus: withThemeProvider(() => <DefaultApp />),
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
        connectors: [wagmiConnectors.ledgerLiveModal],
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
          //       if (typeof window === undefined) return undefined
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
                backgroundColor: 'rgba(0,0,0,0.42)',
                borderRadius: '10px'
              },
              spinnerProps: {
                size: 80,
                invertColor: true
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
                backgroundColor: 'rgba(0,0,0,0.42)',
                borderRadius: '10px'
              },
              spinnerProps: {
                size: 80,
                invertColor: true
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
                containerProps: {
                  backgroundColor: 'rgba(0,0,0,0.42)',
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  invertColor: true
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
              options: {
                name: 'MetaMask',
                shimDisconnect: true,
                getProvider() {
                  if (typeof window === undefined) return undefined
                  try {
                    const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
                    if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                    return provider
                  } catch (error) {
                    return undefined
                  }
                }
              }
            }),
            addConnector(InjectedConnector, {
              options: {
                name: 'Taho',
                shimDisconnect: true,
                getProvider() {
                  if (typeof window === undefined) return undefined
                  try {
                    const provider = window?.tally
                    if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                    return provider
                  } catch (error) {
                    return undefined
                  }
                }
              }
            }),
            addConnector(InjectedConnector, {
              options: {
                name: 'Coinbase Wallet',
                shimDisconnect: true,
                getProvider() {
                  if (typeof window === undefined) return undefined
                  try {
                    const provider =
                      (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                    if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                    return provider
                  } catch (error) {
                    return undefined
                  }
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
                containerProps: {
                  backgroundColor: 'rgba(0,0,0,0.42)',
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  invertColor: true
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
              options: {
                name: 'MetaMask',
                shimDisconnect: true,
                getProvider() {
                  if (typeof window === undefined) return undefined
                  try {
                    const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
                    if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                    return provider
                  } catch (error) {
                    return undefined
                  }
                }
              }
            }),
            addConnector(InjectedConnector, {
              options: {
                name: 'Taho',
                shimDisconnect: true,
                getProvider() {
                  if (typeof window === undefined) return undefined
                  try {
                    const provider = window?.tally
                    if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                    return provider
                  } catch (error) {
                    return undefined
                  }
                }
              }
            }),
            addConnector(InjectedConnector, {
              options: {
                name: 'Coinbase Wallet',
                shimDisconnect: true,
                getProvider() {
                  if (typeof window === undefined) return undefined
                  try {
                    const provider =
                      (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                    if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                    return provider
                  } catch (error) {
                    return undefined
                  }
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
              connectorDisplayOverrides: COMMON_CONNECTOR_OVERRIDES,
              loaderProps: {
                containerProps: {
                  backgroundColor: 'rgba(0,0,0,0.42)',
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  invertColor: true
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
              options: {
                name: 'MetaMask',
                shimDisconnect: true,
                getProvider() {
                  if (typeof window === undefined) return undefined
                  try {
                    const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
                    if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                    return provider
                  } catch (error) {
                    return undefined
                  }
                }
              }
            }),
            addConnector(InjectedConnector, {
              options: {
                name: 'Taho',
                shimDisconnect: true,
                getProvider() {
                  if (typeof window === undefined) return undefined
                  try {
                    const provider = window?.tally
                    if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                    return provider
                  } catch (error) {
                    return undefined
                  }
                }
              }
            }),
            addConnector(InjectedConnector, {
              options: {
                name: 'Coinbase Wallet',
                shimDisconnect: true,
                getProvider() {
                  if (typeof window === undefined) return undefined
                  try {
                    const provider =
                      (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
                    if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
                    return provider
                  } catch (error) {
                    return undefined
                  }
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
                containerProps: {
                  backgroundColor: 'rgba(0,0,0,0.42)',
                  borderRadius: '10px'
                },
                spinnerProps: {
                  size: 80,
                  invertColor: true
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
  })
}
