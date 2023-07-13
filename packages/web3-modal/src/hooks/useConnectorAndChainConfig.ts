import { devDebug } from '@past3lle/utils'
import { IFrameEthereumConnector } from '@past3lle/wagmi-connectors'
import { w3mConnectors } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { Chain } from 'viem'
import { SafeConnector } from 'wagmi/connectors/safe'

import { PstlWeb3AuthConnector } from '../connectors'
import { PstlWeb3ModalProps, addConnector } from '../providers'
import { AppType, getAppType, mapChainsToConnectors } from '../providers/utils/connectors'
import { ConnectorEnhanced } from '../types'

export function useConnectorAndChainConfig(
  config: PstlWeb3ModalProps<number>
): Omit<PstlWeb3ModalProps<number>, 'connectors'> & { connectors: ConnectorEnhanced<any, any>[] } {
  return useMemo(() => {
    const status = getAppType()
    switch (status) {
      case AppType.SAFE_APP: {
        devDebug('[@past3lle/web3-modal] App type detected: SAFE APP')

        const connectors = mapChainsToConnectors([addConnector(SafeConnector, { options: { debug: true } })], config)
        return { ...config, connectors }
      }
      case AppType.IFRAME: {
        devDebug('[@past3lle/web3-modal] App type detected: IFRAME APP')

        const connectors = mapChainsToConnectors(
          [addConnector(IFrameEthereumConnector, {}), ...(config?.frameConnectors || [])],
          config
        )
        return { ...config, connectors }
      }
      case AppType.COSMOS_APP:
      case AppType.DAPP: {
        devDebug('[@past3lle/web3-modal] App type detected: NORMAL DAPP', config?.connectors)

        const userConnectors = mapChainsToConnectors(config?.connectors || [], config)
        const walletConnectProviders = w3mConnectors({
          projectId: config.modals.walletConnect.projectId,
          chains: config.chains as Chain[]
        })

        const connectors = userConnectors.slice()
        // Check user w3a props - if they exist, init web3auth connector
        if (config.modals?.web3auth) {
          connectors.push(PstlWeb3AuthConnector({ chains: config.chains as Chain[], ...config.modals.web3auth }))
        }

        // Check if we have multiple providers via window.ethereum.providersMap (coinbase wallet)
        const userConnectorsContainInjected = userConnectors?.some(
          (conn) => conn.id === 'injected' || conn.id === 'metaMask'
        )
        if (userConnectorsContainInjected) {
          // filter injected providers passed by walletconnect to dedup
          connectors.push(...walletConnectProviders.filter((connector) => connector.id !== 'injected'))
        }
        // otherwise push the walletConnect providers
        // which includes any injected providers
        else {
          connectors.push(...walletConnectProviders)
        }

        return { ...config, connectors }
      }
    }
  }, [config])
}
