import { devDebug } from '@past3lle/utils'
import { iframeEthereum, ledgerLive } from '@past3lle/wagmi-connectors'
// import { IFrameEthereumConnector } from '@past3lle/wagmi-connectors/IFrameConnector'
// import { LedgerIFrameConnector } from '@past3lle/wagmi-connectors/LedgerIFrameConnector'
// import { w3mConnectors } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { CreateConnectorFn, WagmiProviderProps } from 'wagmi'
import { safe } from 'wagmi/connectors'

import { PstlWeb3ModalProps } from '../../providers'
import { getAppType, getConnectorsArrayFromConfig, hardFilterChains } from '../../utils/connectors'

export function useConnectorAndChainConfig<config extends PstlWeb3ModalProps<WagmiProviderProps['config']['chains']>>(
  configProps: config
): Omit<config, 'connectors'> {
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

        const connectors = [safe()]
        return { ...configProps, chains, connectors }
      }
      case 'LEDGER_LIVE': {
        devDebug('[@past3lle/web3-modal] App type detected: LEDGER LIVE')

        const connectors: CreateConnectorFn[] = [ledgerLive()]
        return { ...configProps, chains, connectors }
      }
      case 'IFRAME': {
        devDebug('[@past3lle/web3-modal] App type detected: IFRAME APP')

        const connectors = [iframeEthereum(), ...(getConnectorsArrayFromConfig(configProps?.frameConnectors) || [])]
        return { ...configProps, connectors }
      }
      case 'TEST_FRAMEWORK_IFRAME':
      case 'DAPP': {
        devDebug('[@past3lle/web3-modal] App type detected: NORMAL DAPP', configProps?.connectors)

        return configProps
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
