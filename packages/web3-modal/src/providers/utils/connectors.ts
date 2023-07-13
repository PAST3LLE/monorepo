import { devDebug } from '@past3lle/utils'
import { isIframe } from '@past3lle/wagmi-connectors'
import { Chain } from 'viem'

import { ConnectorEnhanced } from '../../types'
import { PstlWeb3ModalProps } from '../types'

export enum AppStatus {
  IFRAME = 'IFRAME',
  SAFE_APP = 'SAFE_APP',
  DAPP = 'DAPP',
  COSMOS_APP = 'COSMOS_APP'
}
export function getAppStatus() {
  if (process.env.IS_COSMOS) {
    devDebug('[@past3lle/web3-modal::useDynamicConnectors] COSMOS detected, returning connectors unaffected')
    return AppStatus.COSMOS_APP
  } else if (
    isIframe() &&
    typeof global?.window !== undefined &&
    global.window?.location?.href?.includes('app.safe.global/apps')
  )
    return AppStatus.SAFE_APP
  else if (isIframe()) return AppStatus.IFRAME
  else return AppStatus.DAPP
}

export function mapChainsToConnectors(
  connectors: ((chains: Chain[]) => ConnectorEnhanced<any, any>)[],
  config: PstlWeb3ModalProps<number>
) {
  return connectors.map((conn) => conn(config.chains as Chain[]))
}
