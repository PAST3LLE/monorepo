import { devError } from '@past3lle/utils'
import { css } from 'styled-components'

import { RenderConnectorOptionsProps } from '../components/modals/ConnectionModal/RenderConnectorOptions'
import { useConnection, usePstlWeb3Modal } from '../hooks'
import { ConnectorEnhanced, ConnectorEnhancedExtras, DefaultWallets } from '../types'

type GetConnectorInfoCallbacks = {
  connect: RenderConnectorOptionsProps['connect']
  disconnect: RenderConnectorOptionsProps['disconnect']
  open: ReturnType<typeof usePstlWeb3Modal>['open']
  openWalletConnectModal: ReturnType<typeof useConnection>[1]['openWalletConnectModal']
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
  {
    connect,
    disconnect,
    open,
    openWalletConnectModal,
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
  let isModalMounted = true
  switch (connector.id) {
    case DefaultWallets.WEB3AUTH:
      modalType = 'w3a-modal'
      isModalMounted = !!isProviderModalMounted
      break

    case DefaultWallets.WEB3MODAL: {
      modalType = 'w3m-modal'
      isModalMounted = !!isProviderModalMounted
      break
    }

    default:
      isModalMounted = !modalType || !!isProviderModalMounted
      break
  }

  return [
    _getProviderInfo(connector, currentConnector, connectorDisplayOverrides),
    async () =>
      _connectProvider(
        modalType,
        connector,
        currentConnector,
        { chainId, address, closeOnConnect, isModalMounted, connectorDisplayOverrides },
        {
          connect,
          disconnect,
          open,
          openWalletConnectModal,
          closeRootModal,
          setModalLoading: setProviderModaLoading,
          setModalMounted: setProviderModalMounted
        }
      )
  ]
}

const delayWithCondition = async ({
  value,
  limit = 15,
  freq = 1000,
  id
}: {
  value: number
  limit?: number
  freq?: number
  id: string
}): Promise<HTMLElement | null | 'BAILED'> => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        typeof document === undefined || value >= limit ? resolve('BAILED') : resolve(document.getElementById(id)),
      freq
    )
  )
}

const loopFindElementById = async (id: string, limit = 10) => {
  let value = 1
  let result: HTMLElement | null | 'BAILED' = null
  try {
    while (!result) {
      result = await delayWithCondition({ value, limit, id })
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

export function getPosition(position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left') {
  switch (position) {
    case 'top-left':
      return css`
        top: 0.75em;
        left: 0.75em;
      `
    case 'bottom-left':
      return css`
        bottom: 0.75em;
        left: 0.75em;
      `
    case 'bottom-right':
      return css`
        bottom: 0.75em;
        right: 0.75em;
      `
    default:
      return css`
        top: 0.75em;
        right: 0.75em;
      `
  }
}

async function _connectProvider(
  modalId: ProviderModalType,
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  constants: Pick<GetConnectorInfoConstants, 'address' | 'chainId' | 'closeOnConnect' | 'connectorDisplayOverrides'> & {
    isModalMounted?: boolean
  },
  callbacks: Omit<
    GetConnectorInfoCallbacks,
    'setProviderModaLoading' | 'setProviderModalMounted' | 'setW3mModalLoading' | 'setW3mModalMounted'
  > & {
    setModalLoading?: (status: boolean) => void
    setModalMounted?: (status: boolean) => void
  }
) {
  const { address, chainId, isModalMounted, connectorDisplayOverrides } = constants
  const { connect, disconnect, setModalLoading, setModalMounted, open, openWalletConnectModal } = callbacks

  try {
    // Modal has already mounted, skip timeout
    if (isModalMounted) {
      return _handleConnectorClick(
        connector,
        currentConnector,
        { chainId, address, connectorDisplayOverrides },
        { connect, disconnect, open, openWalletConnectModal }
      )
    } else if (!!modalId) {
      // Modal is async imported on use
      // we need to wait ~20 seconds for modal to load and show loader in meantime
      setModalLoading?.(true)

      await Promise.race([
        // timeout and thow after N seconds if we can't find the modal
        loopFindElementById(modalId, 30).catch((error) => {
          throw new Error(error)
        }),
        _handleConnectorClick(
          connector,
          currentConnector,
          { chainId, address },
          { connect, disconnect, open, openWalletConnectModal }
        )
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
  {
    address,
    chainId,
    connectorDisplayOverrides
  }: Pick<GetConnectorInfoConstants, 'address' | 'chainId' | 'connectorDisplayOverrides'>,
  {
    connect,
    disconnect,
    open,
    openWalletConnectModal
  }: Pick<GetConnectorInfoCallbacks, 'open' | 'openWalletConnectModal' | 'connect' | 'disconnect'>
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

  if (address && isConnectedConnector) {
    return open({ route: 'Account' })
  } else {
    if (!!currentConnector) {
      await disconnect(undefined, {
        async onSuccess() {
          await _connectToProvider({ connector, connect, baseConnectorKey, openWalletConnectModal, chainId })
        }
      })
    } else {
      await _connectToProvider({ connector, connect, baseConnectorKey, openWalletConnectModal, chainId })
    }
  }
}

async function _connectToProvider({ connector, openWalletConnectModal, connect, baseConnectorKey, chainId }: any) {
  switch (connector.id) {
    case DefaultWallets.WEB3MODAL:
      return openWalletConnectModal({ route: 'ConnectWallet' })
    default: {
      await connect({ connector, chainId }).catch((error: any) => {
        const errorMessage = new Error(error).message
        const connectorNotFoundError = errorMessage?.includes('ConnectorNotFoundError')

        if (baseConnectorKey?.downloadUrl && connectorNotFoundError && typeof window !== undefined) {
          window.open(baseConnectorKey.downloadUrl, '_newtab')
        }

        throw error
      })
    }
  }
}

export function trimAndLowerCase(thing: string | undefined) {
  if (!thing) return ''

  return thing.replace(' ', '').toLowerCase()
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
