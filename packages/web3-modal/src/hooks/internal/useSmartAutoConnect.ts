import { devDebug } from '@past3lle/utils'
import { useEffect } from 'react'
import { Chain } from 'viem'
import { Connector, useAccount, useConnect } from 'wagmi'

import { ConnectorEnhanced } from '../../types'
import { isIframe, isLedgerDappBrowserProvider } from '../../utils'

export interface SmartAutoConnectProps {
  chainFromUrl: Chain | undefined
  autoConnect?: boolean
}

/**
 * @name useSmartAutoConnect
 * @description Auto connects to iframe contexts that don't expect wallet choices
 */
export function useSmartAutoConnect({ chainFromUrl, autoConnect }: SmartAutoConnectProps) {
  const { connectAsync, connectors } = useConnect()
  const { isDisconnected } = useAccount()

  // Reconnect logic
  useEffect(() => {
    const smartAutoConnect = autoConnect || isIframe() || isLedgerDappBrowserProvider()
    // 1. Are we in an iFrame environment? LedgerLive, Safe, etc.
    // If yes, connect automatically
    const frameConnector = smartAutoConnect && _getIFrameConnector(connectors)
    if (frameConnector) {
      devDebug(
        '[@past3lle/web3-modal::useSmartAutoConnect] iFrame Dapp detected. Compatible connector:',
        frameConnector
      )
      connectAsync({
        connector: frameConnector
      })
    }
  }, [autoConnect, chainFromUrl, connectAsync, connectors, isDisconnected])
}

function _getIFrameConnector(connectors: readonly Connector[]) {
  return connectors.find(
    (connector) =>
      (connector as ConnectorEnhanced & { isIFrame?: boolean })?.isIFrame ||
      connector?.type === 'safe' ||
      connector?.type === 'iframe-ethereum' ||
      connector?.type === 'ledger-live'
  )
}
