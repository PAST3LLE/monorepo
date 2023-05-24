import { useWeb3Modal } from '@web3modal/react'
import { Address, Chain, Connector, useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'

type Callbacks = Pick<ReturnType<typeof useDisconnect>, 'disconnect'> & {
  openW3Modal: ReturnType<typeof useWeb3Modal>['open']
  connect: ReturnType<typeof useConnect>['connectAsync']
}

export type ConnectionHookProps = [
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
  }
]
/**
 * Connect/disconnect Forge apps
 * @returns [connectors, {connect, disconnect}, { error, isError, isIdle, isLoading, isSuccess, pendingConnector }]
 */
export function useConnection(): ConnectionHookProps {
  const { open: openW3Modal, isOpen: isW3mOpen } = useWeb3Modal()
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

  return [
    connectors,
    { connect, disconnect, openW3Modal },
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
      pendingConnector,
      isConnected,
      isConnecting,
      isDisconnected,
      isReconnecting
    }
  ]
}
