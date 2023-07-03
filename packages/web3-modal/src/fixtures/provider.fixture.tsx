import { ButtonVariations, ColumnCenter, PstlButton } from '@past3lle/components'
import { ThemeProvider, createCustomTheme } from '@past3lle/theme'
import React, { ReactNode } from 'react'
import { useTheme } from 'styled-components'
import { useBalance } from 'wagmi'

import { useConnection } from '../hooks'
import { PstlW3Providers } from '../providers'
import { DEFAULT_PROPS, DEFAULT_PROPS_WEB3AUTH } from './config'
import { w3aPlugins, wagmiConnectors, wagmiConnectorsList } from './connectorsAndPlugins'

interface Web3ButtonProps {
  children?: ReactNode
}
const Web3Button = ({ children = <div>Show PSTL Wallet Modal</div> }: Web3ButtonProps) => {
  const [, { openRootModal, openWalletConnectModal }, { address, currentConnector: connector }] = useConnection()

  return (
    <ColumnCenter>
      <PstlButton
        buttonVariant={ButtonVariations.PRIMARY}
        onClick={() =>
          address ? openWalletConnectModal({ route: 'Account' }) : openRootModal({ route: 'ConnectWallet' })
        }
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
  const [, , { address }] = useConnection()
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
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides,
              walletConnect: {
                ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides?.['walletConnect'],
                customName: 'WEB3 MODAL'
              }
            },
            hideInjectedFromRoot: true
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
        wagmiClient: {
          ...DEFAULT_PROPS.wagmiClient,
          options: {
            connectors: [wagmiConnectors.ledgerLiveModal]
          }
        },
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            hideInjectedFromRoot: true,
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides,
              walletConnect: {
                ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides?.['walletConnect'],
                customName: 'WEB3 MODAL'
              },
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
        wagmiClient: {
          ...DEFAULT_PROPS_WEB3AUTH.wagmiClient,
          options: {
            connectors: [wagmiConnectors.ledgerLiveModal]
          }
        },
        modals: {
          ...DEFAULT_PROPS_WEB3AUTH.modals,
          root: {
            ...DEFAULT_PROPS_WEB3AUTH.modals.root,
            walletsView: 'grid',
            width: '640px',
            maxWidth: '100%',
            maxHeight: '550px',
            hideInjectedFromRoot: false,
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS_WEB3AUTH.modals.root?.connectorDisplayOverrides,
              web3auth: {
                ...DEFAULT_PROPS_WEB3AUTH.modals.root?.connectorDisplayOverrides?.['web3auth'],
                customName: 'GMAIL or MOBILE',
                isRecommended: false
              },
              walletConnect: {
                ...DEFAULT_PROPS_WEB3AUTH.modals.root?.connectorDisplayOverrides?.['walletConnect'],
                customName: 'WEB3 MODAL'
              },
              'Brave Wallet': {
                logo: 'https://logodownload.org/wp-content/uploads/2022/04/brave-logo-1.png'
              },
              MetaMask: {
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png'
              },
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
  Grid__SizeDefaults: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        wagmiClient: {
          ...DEFAULT_PROPS.wagmiClient,
          options: {
            connectors: [wagmiConnectors.ledgerLiveModal, wagmiConnectors.ledgerHID]
          }
        },
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            walletsView: 'grid',
            hideInjectedFromRoot: false,
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides,
              MetaMask: {
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png'
              },
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
  List__SizeDefaults: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        wagmiClient: {
          ...DEFAULT_PROPS.wagmiClient,
          options: {
            connectors: [wagmiConnectors.ledgerLiveModal, wagmiConnectors.ledgerHID]
          }
        },
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            walletsView: 'list',
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides,
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
  List__MetaMaskFirstLedgerSecond: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        wagmiClient: {
          ...DEFAULT_PROPS.wagmiClient,
          options: {
            connectors: Object.values(wagmiConnectors)
          }
        },
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            walletsView: 'list',
            hideInjectedFromRoot: false,
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides,
              web3auth: {
                ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides?.['web3auth'],
                isRecommended: false
              },
              MetaMask: {
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png',
                rank: 11,
                isRecommended: true
              },
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
  List__LedgerAutoClose: withThemeProvider(() => (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        wagmiClient: {
          ...DEFAULT_PROPS.wagmiClient,
          options: {
            connectors: [wagmiConnectors.ledgerLiveModal]
          }
        },
        modals: {
          ...DEFAULT_PROPS.modals,
          root: {
            ...DEFAULT_PROPS.modals.root,
            closeModalOnConnect: true,
            walletsView: 'list',
            hideInjectedFromRoot: true,
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides,
              web3auth: {
                ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides?.['web3auth'],
                isRecommended: false
              },
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
          wagmiClient: {
            ...DEFAULT_PROPS.wagmiClient,
            options: {
              connectors: wagmiConnectorsList
            }
          },
          modals: {
            ...DEFAULT_PROPS.modals,
            root: {
              ...DEFAULT_PROPS.modals.root,
              closeModalOnConnect: true,
              walletsView: 'grid',
              hideInjectedFromRoot: false,
              connectorDisplayOverrides: {
                ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides,
                web3auth: {
                  ...DEFAULT_PROPS.modals.root?.connectorDisplayOverrides?.['web3auth'],
                  isRecommended: false
                },
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
                },
                'ledger-hid': {
                  customName: 'LEDGER HID',
                  logo: 'https://crypto-central.io/library/uploads/Ledger-Logo-3.png',
                  rank: 10,
                  isRecommended: true,
                  infoText: {
                    title: 'What is Ledger HID?',
                    content: <strong>Ledger wallet is a cold storage hardware wallet.</strong>
                  }
                },
                MetaMask: {
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png',
                  rank: 11,
                  isRecommended: true
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
    )
  })
}
