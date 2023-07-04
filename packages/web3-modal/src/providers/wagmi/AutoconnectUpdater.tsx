import { devDebug } from '@past3lle/utils'
import { isIframe } from '@past3lle/wagmi-connectors'
import { useEffect } from 'react'
import { useAccount, useConnect, useSwitchNetwork } from 'wagmi'

import { ConnectorEnhanced } from '../../types'

export const AutoconnectUpdater = ({
  chainIdFromUrl,
  persistOnRefresh
}: {
  chainIdFromUrl: number | undefined
  persistOnRefresh: boolean
}) => {
  const { connectAsync, connectors } = useConnect()
  const { switchNetwork } = useSwitchNetwork()
  const { isDisconnected } = useAccount()

  // Reconnect logic
  useEffect(() => {
    if (!isDisconnected) return

    const iFrameConnector = isIframe() && _getIFrameConnector(connectors)
    if (iFrameConnector) {
      devDebug('[AutoConnect]::Dapp browser: CONNECTORS', iFrameConnector)
      connectAsync({
        connector: iFrameConnector
      })
    } else {
      if (!persistOnRefresh) return
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
        await connectAsync({ connector, chainId: chainIdFromUrl })
        if (chainIdFromUrl && chainIdFromUrl !== internalChain) {
          if (!connector.ready) await connector.connect()
          await connector.switchChain?.(chainIdFromUrl)
        }
      }

      smartReconnect()
    }
  }, [chainIdFromUrl, connectAsync, connectors, isDisconnected, persistOnRefresh, switchNetwork])

  return null
}

function _getIFrameConnector(connectors: ConnectorEnhanced<any, any>[]) {
  return connectors.find((connector) => (connector as ConnectorEnhanced<any, any> & { isIFrame?: boolean })?.isIFrame)
}
