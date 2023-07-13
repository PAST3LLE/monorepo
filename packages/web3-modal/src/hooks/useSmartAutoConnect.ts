import { devDebug } from '@past3lle/utils'
import { isIframe } from '@past3lle/wagmi-connectors'
import { useEffect } from 'react'
import { Chain, useAccount, useConnect } from 'wagmi'

import { ConnectorEnhanced } from '../types'

export interface SmartAutoConnectProps {
  chainFromUrl: Chain | undefined
  autoConnect?: boolean
}

export function useSmartAutoConnect({ chainFromUrl, autoConnect }: SmartAutoConnectProps) {
  const { connectAsync, connectors } = useConnect()
  const { isDisconnected } = useAccount()

  // Reconnect logic
  useEffect(() => {
    const frameConnector = isIframe() && _getIFrameConnector(connectors)
    if (frameConnector) {
      devDebug('[AutoConnect]::Dapp browser: CONNECTORS', frameConnector)
      connectAsync({
        connector: frameConnector
      })
    } else {
      if (!isDisconnected || !autoConnect) return
      devDebug('[AutoConnect]::Non-Dapp browser: CONNECTORS', connectors)

      // if wagmi.connected set to true, then wagmi will not show modal
      // to reconnect user wallet, but instead will use prev connection
      // I found this example in this public repo: https://github.com/sumicet/web3auth-modal-wagmi
      const wagmiConnected = localStorage.getItem('wagmi.connected')
      const isWagmiConnected = wagmiConnected ? JSON.parse(wagmiConnected) : false

      if (!isWagmiConnected) return

      async function smartReconnect() {
        const [connector] = connectors
        const internalChain = await connector.getChainId()
        await connectAsync({ connector, chainId: chainFromUrl?.id })
        if (chainFromUrl && chainFromUrl.id !== internalChain) {
          if (!connector.ready) await connector.connect()
          await connector.switchChain?.(chainFromUrl.id)
        }
      }

      smartReconnect()
    }
  }, [autoConnect, chainFromUrl, connectAsync, connectors, isDisconnected])
}

function _getIFrameConnector(connectors: ConnectorEnhanced<any, any>[]) {
  return connectors.find(
    (connector) =>
      (connector as ConnectorEnhanced<any, any> & { isIFrame?: boolean })?.isIFrame || connector?.id === 'safe'
  )
}
