import React, { Dispatch, SetStateAction } from 'react'

import { ProviderMountedMap, PstlWeb3ConnectionModalProps } from '.'
import { UserOptionsCtrlState } from '../../../controllers/types'
import { useConnectDisconnect, useUserConnectionInfo } from '../../../hooks'
import { ConnectFunction, ConnectorEnhanced, ConfigStore } from '../../../types'
import { runConnectorConnectionLogic } from '../../../utils/connectConnector'
import { ConnectorOption } from './ConnectorOption'

const IS_SERVER = typeof globalThis.window === 'undefined'

export type RenderConnectorOptionsProps = Pick<
  PstlWeb3ConnectionModalProps,
  'overrides' | 'hideInjectedFromRoot' | 'chainIdFromUrl' | 'buttonProps'
> & {
  modalView: UserOptionsCtrlState['ui']['walletsView']
  userConnectionInfo: ReturnType<typeof useUserConnectionInfo>
  connect: ConnectFunction
  disconnect: ReturnType<typeof useConnectDisconnect>['disconnect']['disconnectAsync']
  modalsStore: ConfigStore['ui']
  providerMountedState: [ProviderMountedMap, Dispatch<SetStateAction<ProviderMountedMap>>]
  providerLoadingState: [boolean, (loading: boolean) => void]
}
const RenderConnectorOptionsBase =
  ({
    overrides: connectorOverrides,
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
  (connector: ConnectorEnhanced, index: number) => {
    // Don't show "injected" provider if either
    // a. User explicitly states to ignore it
    // b. Window object does NOT contain the injected ethereum proxy object
    if ((hideInjectedFromRoot || (!IS_SERVER && !(window as any)?.ethereum)) && connector.id === 'injected') return null
    const [{ label, icon, connected, isRecommended }, callback] = runConnectorConnectionLogic(
      connector,
      currentConnector,
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
        connectorOverrides
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
        icon={<img src={icon} />}
      />
    )
  }

export const RenderConnectorOptions = RenderConnectorOptionsBase
