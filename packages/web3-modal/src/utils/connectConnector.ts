import { devError } from '@past3lle/utils'

import { RenderConnectorOptionsProps } from '../components/modals/ConnectionModal/RenderConnectorOptions'
import { AllWeb3ModalStore, useConnection, usePstlWeb3Modal } from '../hooks'
import { ConnectorEnhanced, ConnectorEnhancedExtras } from '../types'
import { trimAndLowerCase } from './misc'

type GetConnectorInfoCallbacks = {
  connect: RenderConnectorOptionsProps['connect']
  disconnect: RenderConnectorOptionsProps['disconnect']
  open: ReturnType<typeof usePstlWeb3Modal>['open']
  closeRootModal: ReturnType<typeof usePstlWeb3Modal>['close']
  setProviderModalMounted: (val: boolean) => void
  setProviderModaLoading: (val: boolean) => void
}

type GetConnectorInfoConstants = {
  chainId?: number
  address?: string
  isProviderModalMounted?: boolean
  closeOnConnect?: boolean
  connectorDisplayOverrides?: { [id: string]: ConnectorEnhancedExtras | undefined }
}

type ProviderModalType = 'w3a-modal' | 'w3m-modal' | string | null | undefined

export type ConnectorInfo = { label: string; logo?: string; connected: boolean; isRecommended?: boolean }
export function runConnectorConnectionLogic(
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  modalsStore: AllWeb3ModalStore,
  {
    connect,
    disconnect,
    open,
    closeRootModal,
    setProviderModalMounted,
    setProviderModaLoading
  }: GetConnectorInfoCallbacks,
  { chainId, address, isProviderModalMounted, closeOnConnect, connectorDisplayOverrides }: GetConnectorInfoConstants
): [
  ConnectorInfo,
  ReturnType<typeof useConnection>[1]['connect'] | ReturnType<typeof useConnection>[1]['openWalletConnectModal']
] {
  let modalType: ProviderModalType = (
    connectorDisplayOverrides?.[trimAndLowerCase(connector?.name)] ||
    connectorDisplayOverrides?.[trimAndLowerCase(connector?.id)]
  )?.modalNodeId
  const isModalMounted = !modalType || !!isProviderModalMounted

  return [
    _getProviderInfo(connector, currentConnector, connectorDisplayOverrides),
    async () =>
      _connectProvider(
        modalType,
        connector,
        currentConnector,
        modalsStore,
        { chainId, address, closeOnConnect, isModalMounted, connectorDisplayOverrides },
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
  modalsStore: AllWeb3ModalStore,
  constants: Pick<GetConnectorInfoConstants, 'address' | 'chainId' | 'closeOnConnect' | 'connectorDisplayOverrides'> & {
    isModalMounted?: boolean
  },
  callbacks: Omit<
    GetConnectorInfoCallbacks,
    'setProviderModaLoading' | 'setProviderModalMounted' | 'setW3mModalLoading' | 'setW3mModalMounted' | 'openWalletConnectModal'
  > & {
    setModalLoading?: (status: boolean) => void
    setModalMounted?: (status: boolean) => void
  }
) {
  const { address, chainId, isModalMounted, connectorDisplayOverrides } = constants
  const { connect, disconnect, setModalLoading, setModalMounted, open } = callbacks

  const modalNodeSyncCheck =
    !!modalId && typeof globalThis?.window?.document !== 'undefined' ? document.getElementById(modalId) : null

  const connectCallbackParams: [
    ConnectorEnhanced<any, any>,
    ConnectorEnhanced<any, any> | undefined,
    AllWeb3ModalStore,
    Pick<GetConnectorInfoConstants, 'address' | 'chainId' | 'connectorDisplayOverrides'>,
    Pick<GetConnectorInfoCallbacks, 'open' | 'connect' | 'disconnect'>
  ] = [
    connector,
    currentConnector,
    modalsStore,
    { chainId, address, connectorDisplayOverrides },
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
  connectorDisplayOverrides: GetConnectorInfoConstants['connectorDisplayOverrides']
) {
  const { baseConnectorKey, baseCurrentConnectorKey } = _getConnectorOverrideInfo(
    connector,
    currentConnector,
    connectorDisplayOverrides
  )
  const connected = Boolean(
    baseCurrentConnectorKey
      ? JSON.stringify(baseCurrentConnectorKey) === JSON.stringify(baseConnectorKey)
      : connector.id === currentConnector?.id
  )
  return {
    label: baseConnectorKey?.customName || connector.name,
    logo: baseConnectorKey?.logo || connector?.logo,
    connected,
    isRecommended: baseConnectorKey?.isRecommended
  }
}

async function _handleConnectorClick(
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  modalsStore: AllWeb3ModalStore,
  {
    address,
    chainId,
    connectorDisplayOverrides
  }: Pick<GetConnectorInfoConstants, 'address' | 'chainId' | 'connectorDisplayOverrides'>,
  { connect, disconnect, open }: Pick<GetConnectorInfoCallbacks, 'open' | 'connect' | 'disconnect'>
) {
  const { baseConnectorKey, baseCurrentConnectorKey } = _getConnectorOverrideInfo(
    connector,
    currentConnector,
    connectorDisplayOverrides
  )
  const isConnectedConnector = Boolean(
    baseCurrentConnectorKey
      ? JSON.stringify(baseCurrentConnectorKey) === JSON.stringify(baseConnectorKey)
      : connector.id === currentConnector?.id
  )

    const connectToProviderParams = { connector, connect, modalsStore, connectorOverride: baseConnectorKey, chainId }

  try {
    if (address && isConnectedConnector) {
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
  }
}

async function _connectToProvider({
  connector,
  connect,
  modalsStore,
  connectorOverride,
  chainId
}: Pick<GetConnectorInfoCallbacks, 'connect'> & {
  modalsStore: AllWeb3ModalStore
  connector: ConnectorEnhanced<any, any>
  connectorOverride: ConnectorEnhancedExtras | undefined
  chainId?: number
}) {
  try {
    await (connectorOverride?.customConnect?.(modalsStore) || connect({ connector, chainId }))
  } catch (error: any) {
    const errorMessage = new Error(error).message
    const connectorNotFoundError = errorMessage?.includes('ConnectorNotFoundError')

    if (connectorOverride?.downloadUrl && connectorNotFoundError && typeof globalThis?.window !== 'undefined') {
      window.open(connectorOverride.downloadUrl, '_newtab')
    }

    throw error
  }
}

function _getConnectorOverrideInfo(
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  connectorDisplayOverrides: GetConnectorInfoConstants['connectorDisplayOverrides']
) {
  const trimmedId = trimAndLowerCase(connector?.id)
  const trimmedName = trimAndLowerCase(connector?.name)
  const trimmedCurrentId = trimAndLowerCase(currentConnector?.id)
  const trimmedCurrentName = trimAndLowerCase(currentConnector?.name)

  const baseConnectorKey = connectorDisplayOverrides?.[trimmedId] || connectorDisplayOverrides?.[trimmedName]
  const baseCurrentConnectorKey =
    connectorDisplayOverrides?.[trimmedCurrentId] || connectorDisplayOverrides?.[trimmedCurrentName]

  return { baseConnectorKey, baseCurrentConnectorKey }
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
