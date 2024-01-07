import { devDebug } from '@past3lle/utils'
import { IFrameEthereumConnector } from '@past3lle/wagmi-connectors/IFrameConnector'
import { LedgerIFrameConnector } from '@past3lle/wagmi-connectors/LedgerIFrameConnector'
import { w3mConnectors } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { Chain } from 'viem'
import { SafeConnector } from 'wagmi/connectors/safe'

import { PstlWeb3ModalProps, addConnector } from '../../providers'
import { getAppType, hardFilterChains, mapChainsToConnectors } from '../../providers/utils/connectors'
import { ConnectorEnhanced } from '../../types'

export function useConnectorAndChainConfig(
  configProps: PstlWeb3ModalProps<number>
): Omit<PstlWeb3ModalProps<number>, 'connectors'> & { connectors: ConnectorEnhanced<any, any>[] } {
  // Pick out the deps
  const {
    chains,
    callbacks,
    connectors,
    frameConnectors,
    modals: {
      walletConnect: { projectId: wcProjectId }
    },
    options
  } = configProps
  return useMemo(() => {
    // Config.options.hardFilterChainsCallback call
    // Useful if you need to filter chains based on domain (prod vs dev)
    const chains = hardFilterChains({ callbacks: configProps.callbacks, chains: configProps.chains })
    const status = getAppType(configProps.options?.escapeHatches?.appType)
    switch (status) {
      case 'SAFE_APP': {
        devDebug('[@past3lle/web3-modal] App type detected: SAFE APP')

        const connectors = mapChainsToConnectors([addConnector(SafeConnector, { debug: true })], chains)
        return { ...configProps, chains, connectors }
      }
      case 'LEDGER_LIVE': {
        devDebug('[@past3lle/web3-modal] App type detected: LEDGER LIVE')

        const connectors = mapChainsToConnectors([addConnector(LedgerIFrameConnector, {})], chains)
        return { ...configProps, chains, connectors }
      }
      case 'IFRAME': {
        devDebug('[@past3lle/web3-modal] App type detected: IFRAME APP')

        const connectors = mapChainsToConnectors(
          [
            addConnector(IFrameEthereumConnector, {}),
            ...(_getConnectorsFromConfig(configProps?.frameConnectors) || [])
          ],
          chains
        )
        return { ...configProps, connectors }
      }
      case 'TEST_FRAMEWORK_IFRAME':
      case 'DAPP': {
        devDebug('[@past3lle/web3-modal] App type detected: NORMAL DAPP', configProps?.connectors)

        // Map connectors and pass configProps chains
        const userConnectors = mapChainsToConnectors(_getConnectorsFromConfig(configProps?.connectors) || [], chains)
        const walletConnectProviders = w3mConnectors({
          projectId: wcProjectId,
          chains: configProps.chains as Chain[]
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

        return { ...configProps, connectors }
      }
    }
    // We dont need to pass the entire configs object as a dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    callbacks?.filterChains,
    callbacks?.hardLimitChains,
    chains,
    connectors,
    frameConnectors,
    options?.escapeHatches?.appType,
    wcProjectId
  ])
}

function _getConnectorsFromConfig(connectorsConfig: PstlWeb3ModalProps['connectors']) {
  if (!connectorsConfig || Array.isArray(connectorsConfig)) return connectorsConfig
  else {
    return connectorsConfig.connectors
  }
}
