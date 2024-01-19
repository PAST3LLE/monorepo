import { devError } from '@past3lle/utils'
import isEqual from 'lodash.isequal'
import { UseConnectReturnType } from 'wagmi'

import { RenderConnectorOptionsProps } from '../components/modals/ConnectionModal/RenderConnectorOptions'
import { ModalCtrl, UserOptionsCtrl } from '../controllers'
import { usePstlWeb3Modal } from '../hooks'
import { ConnectorEnhanced, ConnectorEnhancedExtras } from '../types'
import { isProviderOrConnectorNotFoundError } from './errors'
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

const IS_SERVER = typeof globalThis?.window?.document === 'undefined'

export type ConnectorInfo = { label: string; logo?: string; connected: boolean; isRecommended?: boolean }
export function runConnectorConnectionLogic(
  connector: ConnectorEnhanced,
  currentConnector: ConnectorEnhanced | undefined,
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
): [ConnectorInfo, UseConnectReturnType['connect'] | UseConnectReturnType['connectAsync']] {
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
  connector: ConnectorEnhanced,
  currentConnector: ConnectorEnhanced | undefined,
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

  const modalNodeSyncCheck = !!modalId && !IS_SERVER ? document.getElementById(modalId) : null

  const connectCallbackParams: [
    ConnectorEnhanced,
    ConnectorEnhanced | undefined,
    BaseConnectorInfoConstants,
    Pick<GetConnectorInfoCallbacks, 'open' | 'connect' | 'disconnect'>
  ] = [
    connector,
    currentConnector,
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
    console.error('[PstlWeb3ConnectionModal::_getProviderInfo] - Error in loading modal:', error)
    await connector.disconnect()
    throw new Error(error)
  } finally {
    setModalLoading?.(false)
    setModalMounted?.(true)
  }
}

function _getProviderInfo(
  connector: ConnectorEnhanced,
  currentConnector: ConnectorEnhanced | undefined,
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
  connector: ConnectorEnhanced,
  currentConnector: ConnectorEnhanced | undefined,
  { address, chainId, connectorOverrides, isConnected }: BaseConnectorInfoConstants,
  { connect, disconnect, open }: Pick<GetConnectorInfoCallbacks, 'open' | 'connect' | 'disconnect'>
) {
  const { pendingConnectorOverride } = _getConnectorOverrideInfo(connector, currentConnector, connectorOverrides)
  const connectToProviderParams = {
    connector,
    connect,
    connectorOverride: pendingConnectorOverride,
    chainId
  }

  try {
    if (address && isConnected) {
      return open({ route: 'Account' })
    } else {
      if (!!currentConnector) {
        await disconnect(undefined, {
          onSuccess: async () => _connectToProvider(connectToProviderParams)
        })
      } else {
        return _connectToProvider(connectToProviderParams)
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
  connectorOverride
}: Pick<GetConnectorInfoCallbacks, 'connect'> & {
  connector: ConnectorEnhanced
  connectorOverride: ConnectorEnhancedExtras | undefined
}) {
  try {
    await (connectorOverride?.customConnect?.({
      modalsStore: ModalCtrl,
      userStore: UserOptionsCtrl,
      connector,
      wagmiConnect: connect
    }) || connect(connector))
  } catch (error: any) {
    if (!IS_SERVER) {
      if (connectorOverride?.downloadUrl && isProviderOrConnectorNotFoundError(error)) {
        window.open(connectorOverride.downloadUrl, '_newtab')
      }
    }

    throw error
  }
}

function _getConnectorOverrideInfo(
  connector: ConnectorEnhanced,
  currentConnector: ConnectorEnhanced | undefined,
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
    setTimeout(() => (IS_SERVER || value >= limit ? resolve('BAILED') : resolve(document.getElementById(id))), freq)
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
