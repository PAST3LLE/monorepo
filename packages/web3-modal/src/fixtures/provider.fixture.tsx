import { ButtonVariations, ColumnCenter, PstlButton } from '@past3lle/components'
import { ThemeProvider, createCustomTheme } from '@past3lle/theme'
import React, { ReactNode } from 'react'
import { useTheme } from 'styled-components'
import { useAccount } from 'wagmi'

import { useConnection, usePstlWeb3Modal } from '../hooks'
import { PstlW3Providers } from '../providers'
import { DEFAULT_PROPS } from './config'
import { w3aPlugins, wagmiConnectors } from './connectorsAndPlugins'

interface Web3ButtonProps {
  children?: ReactNode
}
const Web3Button = ({ children = <div>Show PSTL Wallet Modal</div> }: Web3ButtonProps) => {
  const [, , { currentConnector: connector }] = useConnection()
  const { open } = usePstlWeb3Modal()
  const { address } = useAccount()

  return (
    <ColumnCenter>
      <PstlButton
        buttonVariant={ButtonVariations.PRIMARY}
        onClick={() => open({ route: address ? 'Account' : 'ConnectWallet' })}
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
  return (
    <PstlW3Providers
      config={{
        ...DEFAULT_PROPS,
        modals: {
          ...DEFAULT_PROPS.modals,
          w3a: {
            ...DEFAULT_PROPS.modals.w3a,
            configureAdditionalConnectors() {
              return [w3aPlugins.torusPlugin]
            }
          }
        }
      }}
    >
      <AppWithWagmiAccess />
      <h1>MODE: {mode}</h1>
      <button onClick={() => setMode(mode === 'LIGHT' ? 'DARK' : 'LIGHT')}>Change theme mode</button>
      <button onClick={() => setMode('DEFAULT')}>Revert to default</button>
      <Web3Button />
    </PstlW3Providers>
  )
}

function AppWithWagmiAccess() {
  const accountApi = useAccount()
  console.debug('Account API', accountApi.connector)

  accountApi.connector?.getProvider().then((res) => console.debug('getProvider', res))
  console.debug('Torus EVM Wallet', accountApi.connector?.options?.web3AuthInstance?.walletAdapters?.['torus-evm'])

  return <h1>Here has wagmi access</h1>
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
          pstl: {
            ...DEFAULT_PROPS.modals.pstl,
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides,
              web3auth: {
                ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides?.['web3auth'],
                customName: 'GMAIL or MOBILE',
                isRecommended: false
              },
              walletConnect: {
                ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides?.['walletConnect'],
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
            connectors: Object.values(wagmiConnectors)
          }
        },
        modals: {
          ...DEFAULT_PROPS.modals,
          pstl: {
            ...DEFAULT_PROPS.modals.pstl,
            hideInjectedFromRoot: true,
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides,
              web3auth: {
                ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides?.['web3auth'],
                customName: 'GMAIL or MOBILE',
                isRecommended: false
              },
              walletConnect: {
                ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides?.['walletConnect'],
                customName: 'WEB3 MODAL'
              },
              ledger: {
                customName: 'LEDGER LIVE',
                logo: 'https://crypto-central.io/library/uploads/Ledger-Logo-3.png',
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
        ...DEFAULT_PROPS,
        wagmiClient: {
          ...DEFAULT_PROPS.wagmiClient,
          options: {
            connectors: Object.values(wagmiConnectors)
          }
        },
        modals: {
          ...DEFAULT_PROPS.modals,
          pstl: {
            ...DEFAULT_PROPS.modals.pstl,
            walletsView: 'grid',
            width: '640px',
            maxWidth: '100%',
            maxHeight: '550px',
            hideInjectedFromRoot: false,
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides,
              web3auth: {
                ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides?.['web3auth'],
                customName: 'GMAIL or MOBILE',
                isRecommended: false
              },
              walletConnect: {
                ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides?.['walletConnect'],
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
            connectors: Object.values(wagmiConnectors)
          }
        },
        modals: {
          ...DEFAULT_PROPS.modals,
          pstl: {
            ...DEFAULT_PROPS.modals.pstl,
            walletsView: 'grid',
            hideInjectedFromRoot: false,
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides,
              MetaMask: {
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png'
              },
              ledger: {
                customName: 'LEDGER LIVE',
                logo: 'https://crypto-central.io/library/uploads/Ledger-Logo-3.png',
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
            connectors: Object.values(wagmiConnectors)
          }
        },
        modals: {
          ...DEFAULT_PROPS.modals,
          pstl: {
            ...DEFAULT_PROPS.modals.pstl,
            walletsView: 'list',
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides,
              ledger: {
                customName: 'LEDGER LIVE',
                logo: 'https://crypto-central.io/library/uploads/Ledger-Logo-3.png',
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
          pstl: {
            ...DEFAULT_PROPS.modals.pstl,
            walletsView: 'list',
            hideInjectedFromRoot: false,
            connectorDisplayOverrides: {
              ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides,
              web3auth: {
                ...DEFAULT_PROPS.modals.pstl?.connectorDisplayOverrides?.['web3auth'],
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
  ))
}
