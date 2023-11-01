import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import React, { memo, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'

import { DEFAULT_CONNECTOR_OVERRIDES } from '../../../constants/wallets'
import { ModalPropsCtrlState } from '../../../controllers/types/controllerTypes'
import {
  useCloseAndUpdateModals,
  useConnectDisconnect,
  usePstlWeb3ModalStore,
  useUserConnectionInfo,
  useAllWeb3Modals as useWeb3Modals
} from '../../../hooks'
import { LoadingScreen } from '../../LoadingScreen'
import { WalletsWrapper } from '../common/styled'
import { BaseModalProps, ModalId } from '../common/types'
import { ConnectorHelper } from './ConnectorHelper'
import { RenderConnectorOptions } from './RenderConnectorOptions'
import { cleanAndFormatConnectorOverrides, sortConnectorsByRank } from './utils'

export type PstlWeb3ConnectionModalProps = BaseModalProps &
  Omit<ModalPropsCtrlState['root'], 'openType'> &
  Pick<ModalPropsCtrlState['connect'], 'walletsView' | 'hideInjectedFromRoot'>

export type ProviderMountedMap = {
  [id: string]: {
    mounted: boolean
  }
}

function ConnectionModalContent({
  openType = 'root',
  hideInjectedFromRoot,
  closeModalOnConnect,
  connectorDisplayOverrides: connectorDisplayOverridesUnformatted,
  walletsView = 'list',
  loaderProps,
  chainIdFromUrl
}: Omit<PstlWeb3ConnectionModalProps, 'theme' | 'type' | 'isOpen' | 'onDismiss'>) {
  const theme = useTheme()
  const isExtraSmallScreen = useIsExtraSmallMediaWidth()
  // We always show list view in tiny screens
  const modalView = isExtraSmallScreen ? 'list' : walletsView

  const uiModalStore = useWeb3Modals()
  const modalState = usePstlWeb3ModalStore()
  const userConnectionInfo = useUserConnectionInfo()

  const {
    connect: { connectAsync: connect },
    disconnect: { disconnectAsync: disconnect }
  } = useConnectDisconnect({
    connect: {
      onError(error) {
        modalState.updateModalProps({
          network: {
            error
          }
        })
      }
    },
    disconnect: {
      onError(error) {
        modalState.updateModalProps({
          network: {
            error
          }
        })
      }
    }
  })

  // Close modal(s) on successful connection & report any errors
  useCloseAndUpdateModals(!!closeModalOnConnect, {
    closeModal: uiModalStore.root.close,
    updateState: modalState.updateModalProps
  })

  const connectorDisplayOverrides = useMemo(
    () => ({
      ...DEFAULT_CONNECTOR_OVERRIDES,
      ...cleanAndFormatConnectorOverrides(connectorDisplayOverridesUnformatted)
    }),
    [connectorDisplayOverridesUnformatted]
  )

  // flag for setting whether or not web3auth modal has mounted as it takes a few seconds first time around
  // and we want to close the pstlModal only after the web3auth modal has mounted
  const providerMountedState = useState<ProviderMountedMap>({})
  const providerLoadingState = useState(false)

  const data = useMemo(
    () =>
      userConnectionInfo.connectors.sort(sortConnectorsByRank(connectorDisplayOverrides)).map(
        RenderConnectorOptions({
          chainIdFromUrl,
          hideInjectedFromRoot,
          openType,
          connectorDisplayOverrides,
          modalView,
          userConnectionInfo,
          connect,
          disconnect,
          modalsStore: {
            ui: uiModalStore,
            updateModalConfig: modalState.updateModalProps
          },
          providerMountedState,
          providerLoadingState,
          theme
        })
      ),
    [
      connect,
      disconnect,
      theme,
      openType,
      modalView,
      uiModalStore,
      modalState.updateModalProps,
      chainIdFromUrl,
      userConnectionInfo,
      providerLoadingState,
      providerMountedState,
      hideInjectedFromRoot,
      connectorDisplayOverrides
    ]
  )

  return (
    <>
      {connectorDisplayOverrides?.general?.infoText?.content && !providerLoadingState[0] && (
        <ConnectorHelper title={connectorDisplayOverrides.general.infoText?.title || 'What is this?'}>
          {connectorDisplayOverrides?.general.infoText.content}
        </ConnectorHelper>
      )}
      {providerLoadingState[0] ? (
        <LoadingScreen {...loaderProps} />
      ) : (
        <WalletsWrapper
          id={`${ModalId.WALLETS}__wallets-wrapper`}
          view={modalView}
          isError={!!modalState.state.connect.error?.message}
        >
          {data}
        </WalletsWrapper>
      )}
    </>
  )
}

export default memo(ConnectionModalContent)
