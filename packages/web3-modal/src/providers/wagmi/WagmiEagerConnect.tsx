import React from 'react'
import { ReactNode, useEffect } from 'react'
import { useAccount, useConnect, useSwitchNetwork } from 'wagmi'

export const WagmiEagerConnect = ({
  chainIdFromUrl,
  persistOnRefresh,
  children
}: {
  chainIdFromUrl: number | undefined
  persistOnRefresh: boolean
  children: ReactNode
}) => {
  const { connectAsync, connectors } = useConnect()
  const { switchNetwork } = useSwitchNetwork()
  const { isDisconnected } = useAccount()

  useEffect(() => {
    if (!persistOnRefresh || !isDisconnected) return

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
  }, [chainIdFromUrl, connectAsync, connectors, isDisconnected, persistOnRefresh, switchNetwork])

  return <>{children}</>
}
