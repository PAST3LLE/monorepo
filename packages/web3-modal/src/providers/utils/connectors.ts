import { devDebug } from '@past3lle/utils'
import { isIframe } from '@past3lle/wagmi-connectors'
import { Chain } from 'viem'

import { ConnectorEnhanced } from '../../types'
import { PstlWeb3ModalProps } from '../types'

export type AppType = 'IFRAME' | 'SAFE_APP' | 'DAPP' | 'TEST_FRAMEWORK_IFRAME'
export function getAppType(forcedAppType?: AppType) {
  if (!!forcedAppType) return forcedAppType
  else if (process.env.IS_COSMOS) {
    devDebug('[@past3lle/web3-modal::getAppType] TEST_FRAMEWORK_IFRAME detected, returning connectors unaffected')
    return 'TEST_FRAMEWORK_IFRAME'
  } else if (isIframe()) {
    const isSafe = window?.location.ancestorOrigins.item(0)?.includes('app.safe.global')
    return isSafe ? 'SAFE_APP' : 'IFRAME'
  } else {
    return 'DAPP'
  }
}

export function mapChainsToConnectors(
  connectors: ((chains: Chain[]) => ConnectorEnhanced<any, any>)[],
  config: PstlWeb3ModalProps<number>
) {
  return connectors.map((conn) => conn?.(config.chains as Chain[]))
}
