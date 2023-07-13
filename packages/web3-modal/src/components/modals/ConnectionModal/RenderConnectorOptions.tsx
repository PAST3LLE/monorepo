import React, { Dispatch, SetStateAction } from 'react'
import { DefaultTheme } from 'styled-components'

import { ProviderMountedMap, PstlWeb3ConnectionModalProps } from '.'
import { ModalPropsCtrlState } from '../../../controllers/types/controllerTypes'
import { useConnectDisconnect, useUserConnectionInfo, useWeb3Modals } from '../../../hooks'
import { ConnectorEnhanced } from '../../../types'
import { runConnectorConnectionLogic, trimAndLowerCase } from '../../../utils'
import { ConnectorOption } from './ConnectorOption'

export type RenderConnectorOptionsProps = Pick<
  PstlWeb3ConnectionModalProps,
  'connectorDisplayOverrides' | 'hideInjectedFromRoot' | 'chainIdFromUrl' | 'buttonProps'
> & {
  openType: ModalPropsCtrlState['root']['openType']
  modalView: 'list' | 'grid'
  theme: DefaultTheme
  userConnectionInfo: ReturnType<typeof useUserConnectionInfo>
  connect: ReturnType<typeof useConnectDisconnect>['connect']['connectAsync']
  disconnect: ReturnType<typeof useConnectDisconnect>['disconnect']['disconnectAsync']
  modalCallbacks: ReturnType<typeof useWeb3Modals>
  providerMountedState: [ProviderMountedMap, Dispatch<SetStateAction<ProviderMountedMap>>]
  providerLoadingState: [boolean, (loading: boolean) => void]
}
const RenderConnectorOptionsBase =
  ({
    openType,
    connectorDisplayOverrides,
    hideInjectedFromRoot,
    chainIdFromUrl,
    buttonProps,
    modalView,
    theme,
    modalCallbacks: { root, walletConnect },
    connect,
    disconnect,
    userConnectionInfo: { connector: currentConnector, chain, address },
    providerMountedState: [providerMountedMap, setProviderMountedMap],
    providerLoadingState: [, setProviderLoading]
  }: RenderConnectorOptionsProps) =>
  (connector: ConnectorEnhanced<any, any>, index: number) => {
    // Don't show "injected" provider if either
    // a. User explicitly states to ignore it
    // b. Window object does NOT contain the injected ethereum proxy object
    if ((hideInjectedFromRoot || !(window as any)?.ethereum) && connector.id === 'injected') return null
    const [{ label, logo, connected, isRecommended }, callback] = runConnectorConnectionLogic(
      connector,
      currentConnector,
      {
        connect,
        disconnect,
        open: openType === 'walletconnect' ? walletConnect.open : root.open,
        openWalletConnectModal: walletConnect.open,
        closeRootModal: root.close,
        setProviderModalMounted: (mounted: boolean) =>
          setProviderMountedMap((currState) => ({
            ...currState,
            [connector.id]: { ...currState[connector.id], mounted }
          })),
        setProviderModaLoading: setProviderLoading
      },
      {
        chainId: chainIdFromUrl || chain?.id,
        address,
        isProviderModalMounted: !!providerMountedMap?.[connector.id]?.mounted,
        connectorDisplayOverrides
      }
    )

    const showHelperText = theme?.modals?.connection?.helpers?.show
    const helperContent = (
      connectorDisplayOverrides?.[trimAndLowerCase(connector?.id)] ||
      connectorDisplayOverrides?.[trimAndLowerCase(connector?.name)]
    )?.infoText

    return (
      <ConnectorOption
        key={connector.id + '_' + index}
        connector={connector}
        callback={callback}
        connected={connected}
        showHelperText={showHelperText}
        buttonProps={buttonProps}
        label={label}
        isRecommended={isRecommended}
        modalView={modalView}
        helperContent={helperContent}
        logo={logo}
      />
    )
  }

export const RenderConnectorOptions = RenderConnectorOptionsBase
