import { useWeb3Modal } from '@web3modal/react'
import { Connector, useConnect, useDisconnect } from 'wagmi'

type Callbacks = Pick<ReturnType<typeof useConnect>, 'connect'> &
  Pick<ReturnType<typeof useDisconnect>, 'disconnect'> & {
    openW3Modal: ReturnType<typeof useWeb3Modal>['open']
  }

export type ConnectionHookProps = [
  Connector<any, any, any>[],
  Callbacks,
  {
    error: Error | null
    isError: boolean
    isIdle: boolean
    isLoading: boolean
    isSuccess: boolean
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
  const { connect, connectors, error, isLoading, pendingConnector, isError, isIdle, isSuccess } = useConnect()
  const { disconnect } = useDisconnect()

  return [
    connectors,
    { connect, disconnect, openW3Modal },
    { error, isError, isIdle, isLoading, isSuccess, isW3mOpen, pendingConnector }
  ]
}
