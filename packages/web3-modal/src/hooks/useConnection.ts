import { useIsSmallMediaWidth } from '@past3lle/hooks'
import { useWeb3Modal } from '@web3modal/react'
import { useCallback } from 'react'
import { Address, Chain, Connector, useAccount, useBalance, useConnect, useDisconnect, useNetwork } from 'wagmi'

import { usePstlWeb3Modal } from './usePstlWeb3Modal'

type Callbacks = Pick<ReturnType<typeof useDisconnect>, 'disconnect'> & {
  openWalletConnectModal: ReturnType<typeof useWeb3Modal>['open']
  closeWalletConnectModal: ReturnType<typeof useWeb3Modal>['close']
  openRootModal: ReturnType<typeof usePstlWeb3Modal>['open']
  closeRootModal: ReturnType<typeof usePstlWeb3Modal>['close']
  onNetworkClick: () => Promise<void>
  onAccountClick: () => Promise<void>
  connect: ReturnType<typeof useConnect>['connectAsync']
}

export type PstlW3mConnectionHook = [
  Connector<any, any>[],
  Callbacks,
  {
    address?: Address
    balanceInfo: ReturnType<typeof useBalance>
    chain?: Chain
    currentConnector: ReturnType<typeof useAccount>['connector']
    error: Error | null
    isError: boolean
    isIdle: boolean
    isLoading: boolean
    isSuccess: boolean
    isConnected: boolean
    isConnecting: boolean
    isDisconnected: boolean
    isReconnecting: boolean
    pendingConnector: Connector<any, any> | undefined
    isWalletConnectOpen: ReturnType<typeof useWeb3Modal>['isOpen']
    isRootModalOpen: ReturnType<typeof usePstlWeb3Modal>['isOpen']
  }
]
/**
 * Connect/disconnect Forge apps
 * @example returns: [
      connectors, 
      {
        openWalletConnectModal: ReturnType<typeof useWeb3Modal>['open']
        closeWalletConnectModal: ReturnType<typeof useWeb3Modal>['close']
        openRootModal: ReturnType<typeof usePstlWeb3Modal>['open']
        closeRootModal: ReturnType<typeof usePstlWeb3Modal>['close']
        onNetworkClick: () => Promise<void>
        onAccountClick: () => Promise<void>
        connect: ReturnType<typeof useConnect>['connectAsync']
      }, 
      { 
        address?: Address
        balanceInfo: ReturnType<typeof useBalance>
        chain?: Chain
        currentConnector: ReturnType<typeof useAccount>['connector']
        error: Error | null
        isError: boolean
        isIdle: boolean
        isLoading: boolean
        isSuccess: boolean
        isConnected: boolean
        isConnecting: boolean
        isDisconnected: boolean
        isReconnecting: boolean
        pendingConnector: Connector<any, any> | undefined
        isWalletConnectOpen: ReturnType<typeof useWeb3Modal>['isOpen']
        isRootModalOpen: ReturnType<typeof usePstlWeb3Modal>['isOpen'] 
      }
    ]
 */
export function useConnection(): PstlW3mConnectionHook {
  const { open: openWalletConnectModal, close: closeWalletConnectModal, isOpen: isWalletConnectOpen } = useWeb3Modal()
  const { open: openRootModal, close: closeRootModal, isOpen: isRootModalOpen } = usePstlWeb3Modal()

  const {
    connectAsync: connect,
    connectors,
    error,
    isLoading,
    pendingConnector,
    isError,
    isIdle,
    isSuccess
  } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, connector, isConnected, isConnecting, isDisconnected, isReconnecting } = useAccount()

  const { chain } = useNetwork()

  const balanceInfo = useBalance({
    address,
    chainId: chain?.id
  })

  const isMobileWidth = useIsSmallMediaWidth()

  const onNetworkClick = useCallback(async () => {
    return chain?.id
      ? openWalletConnectModal({ route: !isMobileWidth ? 'SelectNetwork' : 'Account' })
      : openRootModal({ route: 'ConnectWallet' })
  }, [chain?.id, openRootModal, openWalletConnectModal, isMobileWidth])

  const onAccountClick = useCallback(async () => {
    return chain?.id ? openWalletConnectModal({ route: 'Account' }) : openRootModal({ route: 'ConnectWallet' })
  }, [chain?.id, openRootModal, openWalletConnectModal])

  return [
    connectors,
    {
      connect,
      disconnect,
      openWalletConnectModal,
      closeWalletConnectModal,
      openRootModal,
      closeRootModal,
      onNetworkClick,
      onAccountClick
    },
    {
      address,
      balanceInfo,
      chain,
      currentConnector: connector,
      error,
      isError,
      isIdle,
      isLoading,
      isSuccess,
      isWalletConnectOpen,
      isRootModalOpen,
      pendingConnector,
      isConnected,
      isConnecting,
      isDisconnected,
      isReconnecting
    }
  ]
}
