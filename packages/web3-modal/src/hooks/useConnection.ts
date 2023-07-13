import { useIsSmallMediaWidth } from '@past3lle/hooks'
import { ConnectArgs, ConnectResult } from '@wagmi/core'
import { useWeb3Modal } from '@web3modal/react'
import { useCallback } from 'react'
import { useSnapshot } from 'valtio'
import {
  Address,
  Chain,
  Connector,
  useAccount,
  useBalance,
  useConnect as useConnectWagmi,
  useDisconnect as useDisconnectWagmi,
  useNetwork
} from 'wagmi'

import { ModalPropsCtrl } from '../controllers'
import { usePstlWeb3Modal } from './usePstlWeb3Modal'

type Callbacks = Pick<ReturnType<typeof useDisconnectWagmi>, 'disconnect'> & {
  openWalletConnectModal: ReturnType<typeof useWeb3Modal>['open']
  closeWalletConnectModal: ReturnType<typeof useWeb3Modal>['close']
  openRootModal: ReturnType<typeof usePstlWeb3Modal>['open']
  closeRootModal: ReturnType<typeof usePstlWeb3Modal>['close']
  onNetworkClick: () => Promise<void>
  onAccountClick: () => Promise<void>
  connect: ReturnType<typeof useConnectWagmi>['connectAsync']
}

type DisconnectConfig = {
  /** Function to invoke when an error is thrown while connecting. */
  onError?: (error: Error, context: unknown) => void | Promise<unknown>
  /**
   * Function fires before mutation function and is passed same variables mutation function would receive.
   * Value returned from this function will be passed to both onError and onSettled functions in event of a mutation failure.
   */
  onMutate?: () => unknown
  /** Function to invoke when connect is settled (either successfully connected, or an error has thrown). */
  onSettled?: (error: Error | null, context: unknown) => void | Promise<unknown>
  /** Function fires when mutation is successful and will be passed the mutation's result */
  onSuccess?: (context: unknown) => void | Promise<unknown>
}

type ConnectConfig = DisconnectConfig & {
  /** Function to invoke when connect is settled (either successfully connected, or an error has thrown). */
  onSettled?:
    | ((data: ConnectResult | undefined, error: Error | null, variables: ConnectArgs, context: unknown) => unknown)
    | undefined
}

type UseConnectDisconnectProps = {
  connect?: Partial<ConnectArgs> & ConnectConfig
  disconnect?: DisconnectConfig
}
export function useConnectDisconnect(props?: UseConnectDisconnectProps): {
  connect: ReturnType<typeof useConnectWagmi>
  disconnect: ReturnType<typeof useDisconnectWagmi>
} {
  return { connect: useConnectWagmi(props?.connect), disconnect: useDisconnectWagmi(props?.disconnect) }
}

export function useUserConnectionInfo() {
  const { address, connector, isConnected, isConnecting, isDisconnected, isReconnecting } = useAccount()
  const { chain, chains } = useNetwork()
  const balanceInfo = useBalance({
    address,
    chainId: chain?.id
  })
  const { connectors, pendingConnector } = useConnectWagmi()

  return {
    address,
    pendingConnector,
    connector,
    connectors,
    isConnected,
    isConnecting,
    isDisconnected,
    isReconnecting,
    chain,
    supportedChains: chains,
    balance: balanceInfo
  }
}

export function useWeb3Modals(): {
  root: ReturnType<typeof usePstlWeb3Modal>
  walletConnect: ReturnType<typeof useWeb3Modal>
} {
  return {
    root: usePstlWeb3Modal(),
    walletConnect: useWeb3Modal()
  }
}

export function useAccountNetworkActions() {
  const { chain } = useUserConnectionInfo()
  const { root, walletConnect } = useWeb3Modals()
  const { openType } = useSnapshot(ModalPropsCtrl.state.root)

  const isMobileWidth = useIsSmallMediaWidth()

  const onNetworkClick = useCallback(async () => {
    return chain?.id
      ? (openType === 'walletconnect' ? walletConnect : root).open({
          route: !isMobileWidth ? 'SelectNetwork' : 'Account'
        })
      : root.open({ route: 'ConnectWallet' })
  }, [chain?.id, openType, walletConnect, root, isMobileWidth])

  const onAccountClick = useCallback(async () => {
    return chain?.id
      ? (openType === 'walletconnect' ? walletConnect : root).open({ route: 'Account' })
      : root.open({ route: 'ConnectWallet' })
  }, [chain?.id, openType, root, walletConnect])

  return {
    onAccountClick,
    onNetworkClick
  }
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
type UseConnectionProps = {
  connect: UseConnectDisconnectProps['connect']
  disconnect: UseConnectDisconnectProps['disconnect']
}
export function useConnection(props?: UseConnectionProps): PstlW3mConnectionHook {
  const { root, walletConnect } = useWeb3Modals()

  const {
    connect: { connectAsync: connect, connectors, error, isLoading, pendingConnector, isError, isIdle, isSuccess },
    disconnect: { disconnect }
  } = useConnectDisconnect(props)

  const {
    address,
    chain,
    balance: balanceInfo,
    connector,
    isConnected,
    isConnecting,
    isDisconnected,
    isReconnecting
  } = useUserConnectionInfo()

  const { onAccountClick, onNetworkClick } = useAccountNetworkActions()

  return [
    connectors,
    {
      connect,
      disconnect,
      openWalletConnectModal: walletConnect.open,
      closeWalletConnectModal: walletConnect.close,
      openRootModal: root.open,
      closeRootModal: root.close,
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
      isWalletConnectOpen: walletConnect.isOpen,
      isRootModalOpen: root.isOpen,
      pendingConnector,
      isConnected,
      isConnecting,
      isDisconnected,
      isReconnecting
    }
  ]
}
