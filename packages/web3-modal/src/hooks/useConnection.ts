import { useIsSmallMediaWidth } from '@past3lle/hooks'
import { useWeb3Modal } from '@web3modal/react'
import { useCallback } from 'react'
import { Address, Chain, Connector, useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'

import { usePstlWeb3Modal } from './usePstlWeb3Modal'

type Callbacks = Pick<ReturnType<typeof useDisconnect>, 'disconnect'> & {
  openW3Modal: ReturnType<typeof useWeb3Modal>['open']
  openPstlW3Modal: ReturnType<typeof usePstlWeb3Modal>['open']
  onNetworkClick: () => Promise<void>
  onAccountClick: () => Promise<void>
  connect: ReturnType<typeof useConnect>['connectAsync']
}

export type PstlW3mConnectionHook = [
  Connector<any, any, any>[],
  Callbacks,
  {
    address?: Address
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
    pendingConnector: Connector<any, any, any> | undefined
    isW3mOpen: ReturnType<typeof useWeb3Modal>['isOpen']
    isPstlW3mOpen: ReturnType<typeof usePstlWeb3Modal>['isOpen']
  }
]
/**
 * Connect/disconnect Forge apps
 * @returns [connectors, {connect, disconnect}, { error, isError, isIdle, isLoading, isSuccess, pendingConnector }]
 */
export function useConnection(): PstlW3mConnectionHook {
  const { open: openW3Modal, isOpen: isW3mOpen } = useWeb3Modal()
  const { open: openPstlW3Modal, isOpen: isPstlW3mOpen } = usePstlWeb3Modal()

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

  const isMobileWidth = useIsSmallMediaWidth()

  const onNetworkClick = useCallback(async () => {
    return chain?.id
      ? openW3Modal({ route: !isMobileWidth ? 'SelectNetwork' : 'Account' })
      : openPstlW3Modal({ route: 'ConnectWallet' })
  }, [chain?.id, openPstlW3Modal, openW3Modal, isMobileWidth])

  const onAccountClick = useCallback(async () => {
    return chain?.id ? openW3Modal({ route: 'Account' }) : openPstlW3Modal({ route: 'ConnectWallet' })
  }, [chain?.id, openPstlW3Modal, openW3Modal])

  return [
    connectors,
    { connect, disconnect, openW3Modal, openPstlW3Modal, onNetworkClick, onAccountClick },
    {
      address,
      chain,
      currentConnector: connector,
      error,
      isError,
      isIdle,
      isLoading,
      isSuccess,
      isW3mOpen,
      isPstlW3mOpen,
      pendingConnector,
      isConnected,
      isConnecting,
      isDisconnected,
      isReconnecting
    }
  ]
}
