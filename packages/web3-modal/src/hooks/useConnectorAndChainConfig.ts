import { devDebug } from '@past3lle/utils'
import { IFrameEthereumConnector } from '@past3lle/wagmi-connectors'
import { SafeConnector } from '@wagmi/connectors/safe'
import { w3mConnectors } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { Chain } from 'viem'

import { PstlWeb3ModalProps, addConnector } from '../providers'
import { filterChains, getAppType, mapChainsToConnectors } from '../providers/utils/connectors'
import { ConnectorEnhanced } from '../types'

export function useConnectorAndChainConfig(
  configProps: PstlWeb3ModalProps<number>
): Omit<PstlWeb3ModalProps<number>, 'connectors'> & { connectors: ConnectorEnhanced<any, any>[] } {
  return useMemo(() => {
    // Config.options.filterChainsCallback call
    // Useful if you need to filter chains based on domain (prod vs dev)
    const config = filterChains(configProps)
    const status = getAppType(config.options?.escapeHatches?.appType)
    switch (status) {
      case 'SAFE_APP': {
        devDebug('[@past3lle/web3-modal] App type detected: SAFE APP')

        const connectors = mapChainsToConnectors([addConnector(SafeConnector, { debug: true })], config)
        return { ...config, connectors }
      }
      case 'IFRAME': {
        devDebug('[@past3lle/web3-modal] App type detected: IFRAME APP')

        const connectors = mapChainsToConnectors(
          [addConnector(IFrameEthereumConnector, {}), ...(config?.frameConnectors || [])],
          config
        )
        return { ...config, connectors }
      }
      case 'TEST_FRAMEWORK_IFRAME':
      case 'DAPP': {
        devDebug('[@past3lle/web3-modal] App type detected: NORMAL DAPP', config?.connectors)

        // Map connectors and pass config chains
        const userConnectors = mapChainsToConnectors(config?.connectors || [], config)
        const walletConnectProviders = w3mConnectors({
          projectId: config.modals.walletConnect.projectId,
          chains: config.chains as Chain[]
        })

        const connectors = userConnectors.slice()

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
  }, [configProps])
}
