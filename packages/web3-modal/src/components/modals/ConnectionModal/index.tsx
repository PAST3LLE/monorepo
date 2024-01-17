import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { Connector } from 'wagmi'

import { UserOptionsCtrlState } from '../../../controllers/types'
import {
  useConnectDisconnect,
  usePstlWeb3ModalStore,
  useUserConnectionInfo,
  useAllWeb3Modals as useWeb3Modals
} from '../../../hooks'
import { isProviderOrConnectorNotFoundError } from '../../../utils/errors'
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
  } = useConnectDisconnect({
    connect: {
      mutation: {
        async onSuccess() {
          store.callbacks.connectionStatus.set({ status: 'success' })
          if (closeModalOnConnect) uiModalStore.root.close()
          else return uiModalStore.root.open({ route: 'Account' })
        },
        async onError(error) {
          // Head back to wallets if it's an "unfound" wallet error
          // e.g user doesnt have wallet installed and should pick another wallet
          if (isProviderOrConnectorNotFoundError(error)) {
            await store.callbacks.open({ route: 'ConnectWallet' })
          }
          // Else set the error in the approval modal
          else {
            store.callbacks.connectionStatus.set({ status: 'error' })
          }

          return store.callbacks.error.set(error)
        }
      }
    },
    disconnect: {
      mutation: {
        onError(error) {
          store.callbacks.error.set(error)
        }
      }
    }
  })

  const connect = useCallback(
    async (connector: Connector) => {
      // open connection status modal
      uiModalStore.root.open({
        route: 'ConnectionApproval'
      })

      // Set connection status state
      store.callbacks.connectionStatus.set({
        ids: [connector?.id, connector?.type, connector?.name],
        status: 'pending',
        retry: async () => connect(connector)
      })

      return connectAsync({ connector })
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
      userConnectionInfo.connectors
        .slice()
        .sort(sortConnectorsByRank(overrides))
        .map(
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
