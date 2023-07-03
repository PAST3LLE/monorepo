import React, { Dispatch, SetStateAction } from 'react'
import { DefaultTheme } from 'styled-components'

import { ProviderMountedMap, PstlWeb3ConnectionModalProps } from '.'
import { useConnection } from '../../hooks'
import { ConnectorEnhanced } from '../../types'
import { runConnectorConnectionLogic } from '../../utils'
import { ConnectorOption } from './ConnectorOption'

type RenderConnectorOptionsProps = Pick<
  PstlWeb3ConnectionModalProps,
  'connectorDisplayOverrides' | 'hideInjectedFromRoot' | 'chainIdFromUrl' | 'buttonProps'
> & {
  modalView: 'list' | 'grid'
  theme: DefaultTheme
  connectionState: ReturnType<typeof useConnection>
  providerMountedState: [ProviderMountedMap, Dispatch<SetStateAction<ProviderMountedMap>>]
  providerLoadingState: [boolean, (loading: boolean) => void]
}
const RenderConnectorOptionsBase =
  ({
    connectorDisplayOverrides,
    hideInjectedFromRoot,
    chainIdFromUrl,
    buttonProps,
    modalView,
    theme,
    connectionState: [, { openWalletConnectModal, closeRootModal, connect }, { chain, address, currentConnector }],
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
        openWalletConnectModal,
        closeRootModal,
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
    const helperContent = (connectorDisplayOverrides?.[connector.id] || connectorDisplayOverrides?.[connector.name])
      ?.infoText

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
