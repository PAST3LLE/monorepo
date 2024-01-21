import { devDebug } from '@past3lle/utils'
import { isIframe } from '@past3lle/wagmi-connectors/utils'
import { Connector } from 'wagmi'

import { usePstlWeb3ModalStore } from '../hooks'
import { PstlWeb3ModalProps } from '../providers/types'
import { isLedgerDappBrowserProvider } from './iframe'

export type AppType = 'IFRAME' | 'SAFE_APP' | 'LEDGER_LIVE' | 'DAPP' | 'TEST_FRAMEWORK_IFRAME'
export function getAppType(forcedAppType?: AppType) {
  if (!!forcedAppType) return forcedAppType
  else if (process.env.IS_COSMOS) {
    devDebug('[@past3lle/web3-modal::getAppType] TEST_FRAMEWORK_IFRAME detected, returning connectors unaffected')
    return 'TEST_FRAMEWORK_IFRAME'
  } else if (isIframe() || isLedgerDappBrowserProvider()) {
    const isLedgerLive = isLedgerDappBrowserProvider()
    const isSafe = window?.location.ancestorOrigins.item(0)?.includes('app.safe.global')
    return isSafe ? 'SAFE_APP' : isLedgerLive ? 'LEDGER_LIVE' : 'IFRAME'
  } else {
    return 'DAPP'
  }
}

export function useDeriveAppType() {
  const {
    state: {
      userOptions: {
        ux: { appType }
      }
    }
  } = usePstlWeb3ModalStore()

  return getAppType(appType)
}

export function hardFilterChains({ callbacks, chains }: Pick<PstlWeb3ModalProps, 'chains' | 'callbacks'>) {
  const limitChainsFn = callbacks?.filterChains || callbacks?.hardLimitChains
  if (!limitChainsFn) return chains

  return limitChainsFn(chains)
}

export function softFilterChains(config: PstlWeb3ModalProps): PstlWeb3ModalProps {
  if (!config.callbacks?.softLimitChains) return config
  const limitChainsFn = config.callbacks.softLimitChains

  const filteredChains = limitChainsFn(config.chains)
  return {
    ...config,
    chains: filteredChains
  }
}

export function filterOutConnectorsTypes(arr: readonly Connector[], ...typesToIgnore: Connector['type'][]) {
  return arr.filter((cc) => !typesToIgnore.includes(cc?.id))
}

export function getConnectorsArrayFromConfig(connectorsConfig: PstlWeb3ModalProps['connectors']) {
  if (!connectorsConfig || Array.isArray(connectorsConfig)) return connectorsConfig
  else {
    return connectorsConfig.connectors
  }
}