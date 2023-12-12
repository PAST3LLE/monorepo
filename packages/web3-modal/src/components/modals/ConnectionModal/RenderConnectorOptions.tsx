import React, { Dispatch, SetStateAction } from 'react'

import { ProviderMountedMap, PstlWeb3ConnectionModalProps } from '.'
import { UserOptionsCtrlState } from '../../../controllers/types/controllerTypes'
import { useConnectDisconnect, useUserConnectionInfo } from '../../../hooks'
import { ConnectorEnhanced, FullWeb3ModalStore } from '../../../types'
import { runConnectorConnectionLogic } from '../../../utils/connectConnector'
import { ConnectorOption } from './ConnectorOption'

export type RenderConnectorOptionsProps = Pick<
  PstlWeb3ConnectionModalProps,
  'overrides' | 'hideInjectedFromRoot' | 'chainIdFromUrl' | 'buttonProps'
> & {
  modalView: UserOptionsCtrlState['ui']['walletsView']
  userConnectionInfo: ReturnType<typeof useUserConnectionInfo>
  connect: ReturnType<typeof useConnectDisconnect>['connect']['connectAsync']
  disconnect: ReturnType<typeof useConnectDisconnect>['disconnect']['disconnectAsync']
  modalsStore: FullWeb3ModalStore['ui']
  providerMountedState: [ProviderMountedMap, Dispatch<SetStateAction<ProviderMountedMap>>]
  providerLoadingState: [boolean, (loading: boolean) => void]
}
const RenderConnectorOptionsBase =
  ({
    overrides: connectorDisplayOverrides,
    hideInjectedFromRoot,
    chainIdFromUrl,
    buttonProps,
    modalView,
    modalsStore,
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
      modalsStore,
      {
        connect,
        disconnect,
        open: modalsStore.root.open,
        closeRootModal: modalsStore.root.close,
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

    return (
      <ConnectorOption
        // keys and ids
        key={connector.id + '_' + index}
        optionType={'wallet'}
        optionValue={connector.name}
        // data props
        callback={callback}
        connected={connected}
        buttonProps={buttonProps}
        label={label}
        isRecommended={isRecommended}
        modalView={modalView}
        logo={<img src={logo} />}
      />
    )
  }

export const RenderConnectorOptions = RenderConnectorOptionsBase
