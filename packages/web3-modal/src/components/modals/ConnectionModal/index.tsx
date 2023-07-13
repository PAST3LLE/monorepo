import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import React, { memo, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'

import { ModalPropsCtrlState } from '../../../controllers/types/controllerTypes'
import { useConnectDisconnect, usePstlWeb3ModalState, useUserConnectionInfo, useWeb3Modals } from '../../../hooks'
import { LoadingScreen } from '../../LoadingScreen'
import { WalletsWrapper } from '../common/styled'
import { BaseModalProps } from '../common/types'
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

  const modalCallbacks = useWeb3Modals()
  const modalState = usePstlWeb3ModalState()
  const userConnectionInfo = useUserConnectionInfo()
  const {
    connect: { connectAsync: connect },
    disconnect: { disconnectAsync: disconnect }
  } = useConnectDisconnect({
    connect: {
      onSuccess() {
        closeModalOnConnect && modalCallbacks.root.close()
      },
      onError(error) {
        modalState.updateModalProps({
          connect: {
            error
          }
        })
      }
    }
  })

  const connectorDisplayOverrides = useMemo(
    () => cleanAndFormatConnectorOverrides(connectorDisplayOverridesUnformatted),
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
          modalCallbacks,
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
      modalCallbacks,
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
        <WalletsWrapper view={modalView} isError={!!modalState.modalProps.connect.error?.message}>
          {data}
        </WalletsWrapper>
      )}
    </>
  )
}

export const ConnectionModal = memo(ConnectionModalContent)
