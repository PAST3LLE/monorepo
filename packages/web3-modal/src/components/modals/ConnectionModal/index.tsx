import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import React, { memo, useCallback, useMemo, useState } from 'react'

import { ErrorCauses } from '../../../constants/errors'
import { UserOptionsCtrlState } from '../../../controllers/types'
import {
  useConnectDisconnectAndCloseModals, // useConnectDisconnect,
  usePstlWeb3ModalStore,
  useUserConnectionInfo,
  useAllWeb3Modals as useWeb3Modals
} from '../../../hooks'
import { LoadingScreen } from '../../LoadingScreen'
import { WalletsWrapper } from '../common/styled'
import { BaseModalProps, ModalId } from '../common/types'
import { RenderConnectorOptions } from './RenderConnectorOptions'
import { cleanAndFormatConnectorOverrides, sortConnectorsByRank } from './utils'

export type PstlWeb3ConnectionModalProps = Omit<BaseModalProps, 'modal'> &
  Pick<UserOptionsCtrlState['ux'], 'closeModalOnConnect'> &
  Pick<UserOptionsCtrlState['ui'], 'chainImages' | 'walletsView'> &
  Pick<UserOptionsCtrlState['connectors'], 'overrides' | 'hideInjectedFromRoot'>

export type ProviderMountedMap = {
  [id: string]: {
    mounted: boolean
  }
}
function ConnectionModalContent({
  hideInjectedFromRoot,
  closeModalOnConnect,
  overrides: overridesUnformatted,
  walletsView = 'list',
  loaderProps,
  chainIdFromUrl
}: Omit<PstlWeb3ConnectionModalProps, 'theme' | 'type' | 'isOpen' | 'onDismiss'>) {
  const isExtraSmallScreen = useIsExtraSmallMediaWidth()
  // We always show list view in tiny screens
  const modalView = isExtraSmallScreen ? 'list' : walletsView

  const uiModalStore = useWeb3Modals()
  const store = usePstlWeb3ModalStore()
  const userConnectionInfo = useUserConnectionInfo()

  const {
    connect: { connectAsync },
    disconnect: { disconnectAsync: disconnect }
  } = useConnectDisconnectAndCloseModals(
    !!closeModalOnConnect,
    // Connect
    {
      onSuccess() {
        store.callbacks.connectionStatus.set({ status: 'success' })
        if (closeModalOnConnect) uiModalStore.root.close()
        else uiModalStore.root.open({ route: 'Account' })
      },
      onError: async (error) => {
        if (error?.name?.includes(ErrorCauses.ConnectorNotFoundError)) {
          await store.callbacks.open({ route: 'ConnectWallet' })
        } else {
          store.callbacks.connectionStatus.set({ status: 'error' })
        }

        store.callbacks.error.set(error)
      }
    },
    // Disconnect
    {
      onError(error) {
        store.callbacks.error.set(error)
      }
    }
  )
  const connect = useCallback(
    async (args: Parameters<typeof connectAsync>[0]) => {
      // open connection status modal
      uiModalStore.root.open({
        route: 'ConnectionApproval'
      })

      // Set connection status state
      store.callbacks.connectionStatus.set({
        ids: [args?.connector?.name || 'unknown', args?.connector?.id || 'unknown'],
        status: 'loading',
        retry: async () => connect(args)
      })

      const connectionInfo = await connectAsync(args)

      return connectionInfo
    },
    [connectAsync, store.callbacks.connectionStatus, uiModalStore.root]
  )

  const overrides = useMemo(() => cleanAndFormatConnectorOverrides(overridesUnformatted), [overridesUnformatted])

  // flag for setting whether or not web3auth modal has mounted as it takes a few seconds first time around
  // and we want to close the pstlModal only after the web3auth modal has mounted
  const providerMountedState = useState<ProviderMountedMap>({})
  const providerLoadingState = useState(false)

  const data = useMemo(
    () =>
      userConnectionInfo.connectors.sort(sortConnectorsByRank(overrides)).map(
        RenderConnectorOptions({
          chainIdFromUrl,
          hideInjectedFromRoot,
          overrides,
          modalView,
          userConnectionInfo,
          connect,
          disconnect,
          modalsStore: uiModalStore,
          providerMountedState,
          providerLoadingState
        })
      ),
    [
      connect,
      disconnect,
      modalView,
      uiModalStore,
      chainIdFromUrl,
      userConnectionInfo,
      providerLoadingState,
      providerMountedState,
      hideInjectedFromRoot,
      overrides
    ]
  )

  return (
    <>
      {providerLoadingState[0] ? (
        <LoadingScreen {...loaderProps} />
      ) : (
        <WalletsWrapper
          id={`${ModalId.WALLETS}__wallets-wrapper`}
          modal="connection"
          node="main"
          view={modalView}
          isError={!!store.state.modal.error?.message}
        >
          {data}
        </WalletsWrapper>
      )}
    </>
  )
}

export default memo(ConnectionModalContent)
