import { devError } from '@past3lle/utils'
import isEqual from 'lodash.isequal'

import { RenderConnectorOptionsProps } from '../components/modals/ConnectionModal/RenderConnectorOptions'
import { ErrorCauses } from '../constants/errors'
import { useConnection, usePstlWeb3Modal } from '../hooks'
import { ConnectorEnhanced, ConnectorEnhancedExtras, FullWeb3ModalStore } from '../types'
import { connectorOverridePropSelector, trimAndLowerCase } from './misc'

type GetConnectorInfoCallbacks = {
  connect: RenderConnectorOptionsProps['connect']
  disconnect: RenderConnectorOptionsProps['disconnect']
  open: ReturnType<typeof usePstlWeb3Modal>['open']
  closeRootModal: ReturnType<typeof usePstlWeb3Modal>['close']
  setProviderModalMounted: (val: boolean) => void
  setProviderModaLoading: (val: boolean) => void
}

interface BaseConnectorInfoConstants {
  chainId?: number
  address?: string
  isConnected: boolean
  connectorOverrides?: { [id: string]: ConnectorEnhancedExtras | undefined }
}

interface AuxConnectorInfoConstants extends BaseConnectorInfoConstants {
  isProviderModalMounted?: boolean
  closeOnConnect?: boolean
}

type ProviderModalType = 'w3a-modal' | 'w3m-modal' | string | null | undefined

export type ConnectorInfo = { label: string; logo?: string; connected: boolean; isRecommended?: boolean }
export function runConnectorConnectionLogic(
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  modalsStore: FullWeb3ModalStore['ui'],
  {
    connect,
    disconnect,
    open,
    closeRootModal,
    setProviderModalMounted,
    setProviderModaLoading
  }: GetConnectorInfoCallbacks,
  {
    chainId,
    address,
    isProviderModalMounted,
    closeOnConnect,
    connectorOverrides
  }: Omit<AuxConnectorInfoConstants, 'isConnected'>
): [
  ConnectorInfo,
  ReturnType<typeof useConnection>[1]['connect'] | ReturnType<typeof useConnection>[1]['openWalletConnectModal']
] {
  const modalType: ProviderModalType = connectorOverridePropSelector(connectorOverrides, connector)?.modalNodeId
  const isModalMounted = !modalType || !!isProviderModalMounted
  const providerInfo = _getProviderInfo(connector, currentConnector, connectorOverrides)
  return [
    providerInfo,
    async () =>
      _connectProvider(
        modalType,
        connector,
        currentConnector,
        modalsStore,
        {
          chainId,
          address,
          closeOnConnect,
          isModalMounted,
          isConnected: providerInfo.connected,
          connectorOverrides
        },
        {
          connect,
          disconnect,
          open,
          closeRootModal,
          setModalLoading: setProviderModaLoading,
          setModalMounted: setProviderModalMounted
        }
      )
  ]
}

async function _connectProvider(
  modalId: ProviderModalType,
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  modalsStore: FullWeb3ModalStore['ui'],
  constants: AuxConnectorInfoConstants & {
    isModalMounted?: boolean
  },
  callbacks: Omit<
    GetConnectorInfoCallbacks,
    | 'setProviderModaLoading'
    | 'setProviderModalMounted'
    | 'setW3mModalLoading'
    | 'setW3mModalMounted'
    | 'openWalletConnectModal'
  > & {
    setModalLoading?: (status: boolean) => void
    setModalMounted?: (status: boolean) => void
  }
) {
  const { address, chainId, isModalMounted, isConnected, connectorOverrides } = constants
  const { connect, disconnect, setModalLoading, setModalMounted, open } = callbacks

  const modalNodeSyncCheck =
    !!modalId && typeof globalThis?.window?.document !== 'undefined' ? document.getElementById(modalId) : null

  const connectCallbackParams: [
    ConnectorEnhanced<any, any>,
    ConnectorEnhanced<any, any> | undefined,
    FullWeb3ModalStore['ui'],
    BaseConnectorInfoConstants,
    Pick<GetConnectorInfoCallbacks, 'open' | 'connect' | 'disconnect'>
  ] = [
    connector,
    currentConnector,
    modalsStore,
    { chainId, address, connectorOverrides, isConnected },
    { connect, disconnect, open }
  ]

  try {
    // Modal has already mounted, skip timeout
    if (isModalMounted || modalNodeSyncCheck) {
      return _handleConnectorClick(...connectCallbackParams)
    } else if (!!modalId) {
      // Modal is async imported on use
      // we need to wait ~20 seconds for modal to load and show loader in meantime
      setModalLoading?.(true)

      await Promise.race([
        // timeout and thow after N seconds if we can't find the modal
        loopFindElementById(modalId, 30).catch((error) => {
          throw new Error(error)
        }),
        _handleConnectorClick(...connectCallbackParams)
      ])
    }
  } catch (error: any) {
    await connector.disconnect()
    console.error('[PstlWeb3ConnectionModal::_getProviderInfo] - Error in loading modal:', error)
    throw new Error(error)
  } finally {
    setModalLoading?.(false)
    setModalMounted?.(true)
  }
}

function _getProviderInfo(
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  connectorOverrides: BaseConnectorInfoConstants['connectorOverrides']
) {
  const { pendingConnectorOverride, connectedConnectorOverride } = _getConnectorOverrideInfo(
    connector,
    currentConnector,
    connectorOverrides
  )
  let connected = false
  if (connectedConnectorOverride) {
    connected = isEqual(connectedConnectorOverride, pendingConnectorOverride)
  } else {
    connected = connector.id === currentConnector?.id
  }

  return {
    label: pendingConnectorOverride?.customName || connector.name,
    logo: pendingConnectorOverride?.logo || connector?.logo,
    connected,
    isRecommended: pendingConnectorOverride?.isRecommended
  }
}

async function _handleConnectorClick(
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  modalsStore: FullWeb3ModalStore['ui'],
  { address, chainId, connectorOverrides, isConnected }: BaseConnectorInfoConstants,
  { connect, disconnect, open }: Pick<GetConnectorInfoCallbacks, 'open' | 'connect' | 'disconnect'>
) {
  const { pendingConnectorOverride } = _getConnectorOverrideInfo(connector, currentConnector, connectorOverrides)
  const connectToProviderParams = {
    connector,
    connect,
    modalsStore,
    connectorOverride: pendingConnectorOverride,
    chainId
  }

  try {
    if (address && isConnected) {
      return open({ route: 'Account' })
    } else {
      if (!!currentConnector) {
        await disconnect(undefined, {
          async onSuccess() {
            await _connectToProvider(connectToProviderParams)
          }
        })
      } else {
        await _connectToProvider(connectToProviderParams)
      }
    }
  } catch (error: any) {
    devError('[__handleConnectorClick] Error handling connection.', error)
    throw error
  }
}

async function _connectToProvider({
  connector,
  connect,
  modalsStore,
  connectorOverride,
  chainId
}: Pick<GetConnectorInfoCallbacks, 'connect'> & {
  modalsStore: FullWeb3ModalStore['ui']
  connector: ConnectorEnhanced<any, any>
  connectorOverride: ConnectorEnhancedExtras | undefined
  chainId?: number
}) {
  try {
    await (connectorOverride?.customConnect?.({ store: modalsStore, connector, wagmiConnect: connect }) ||
      connect({ connector, chainId }))
  } catch (error: any) {
    const connectorNotFoundError: boolean = (error?.message || error)?.includes(ErrorCauses.ConnectorNotFoundError)

    if (connectorOverride?.downloadUrl && connectorNotFoundError && typeof globalThis?.window !== 'undefined') {
      window.open(connectorOverride.downloadUrl, '_newtab')
    }

    throw error
  }
}

function _getConnectorOverrideInfo(
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  connectorOverrides: BaseConnectorInfoConstants['connectorOverrides']
) {
  const trimmedId = trimAndLowerCase(connector?.id)
  const trimmedName = trimAndLowerCase(connector?.name)
  const trimmedCurrentId = trimAndLowerCase(currentConnector?.id)
  const trimmedCurrentName = trimAndLowerCase(currentConnector?.name)

  const pendingConnectorOverride = connectorOverrides?.[trimmedId] || connectorOverrides?.[trimmedName]
  const connectedConnectorOverride = connectorOverrides?.[trimmedCurrentId] || connectorOverrides?.[trimmedCurrentName]

  return { pendingConnectorOverride, connectedConnectorOverride }
}

async function _delayFindDomById({
  value,
  limit = 15,
  freq = 1000,
  id
}: {
  value: number
  limit?: number
  freq?: number
  id: string
}): Promise<HTMLElement | null | 'BAILED'> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        typeof globalThis?.window?.document === 'undefined' || value >= limit
          ? resolve('BAILED')
          : resolve(document.getElementById(id)),
      freq
    )
  )
}

async function loopFindElementById(id: string, limit = 10) {
  let value = 1
  let result: HTMLElement | null | 'BAILED' = null
  try {
    while (!result) {
      result = await _delayFindDomById({ value, limit, id })
        .then((res) => {
          if (res === 'BAILED') throw '[loopFindElementById] Timeout searching for ' + id
          return res
        })
        .catch((error) => {
          devError(error)
          return 'BAILED'
        })
      value = value + 1
    }
  } catch (error: any) {
    console.error(new Error('[PstlWeb3ConnectionModal::loopFindElementById]', error))
    throw error
  }

  return result
}
