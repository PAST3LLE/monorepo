import { css } from 'styled-components'

import { useConnection, usePstlWeb3Modal } from '../hooks'
import { ConnectorEnhanced, ConnectorEnhancedExtras, DefaultWallets } from '../types'

type GetConnectorInfoCallbacks = {
  connect: (...params: any[]) => Promise<any>
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
          throw error
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
  const { connect, setModalLoading, setModalMounted, openWalletConnectModal } = callbacks

  try {
    // Modal has already mounted, skip timeout
    if (isModalMounted) {
      return _handleConnectorClick(
        connector,
        currentConnector,
        { chainId, address, connectorDisplayOverrides },
        { connect, openWalletConnectModal }
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
        _handleConnectorClick(connector, currentConnector, { chainId, address }, { connect, openWalletConnectModal })
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
  const baseConnectorKey =
    connectorDisplayOverrides?.[trimAndLowerCase(connector?.id)] ||
    connectorDisplayOverrides?.[trimAndLowerCase(connector?.name)]
  return {
    label: baseConnectorKey?.customName || connector.name,
    logo: baseConnectorKey?.logo || connector?.logo,
    connected: Boolean(currentConnector && currentConnector.id === connector.id),
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
  { connect, openWalletConnectModal }: Pick<GetConnectorInfoCallbacks, 'openWalletConnectModal' | 'connect'>
) {
  const isConnectedConnector = currentConnector?.id === connector.id
  if (address && isConnectedConnector) {
    return openWalletConnectModal({ route: 'Account' })
  } else {
    await currentConnector?.disconnect()

    switch (connector.id) {
      case DefaultWallets.WEB3MODAL:
        return openWalletConnectModal({ route: 'ConnectWallet' })
      default: {
        return connect({ connector, chainId }).catch((error) => {
          const errorMessage = new Error(error).message
          const connectorNotFoundError = errorMessage?.includes('ConnectorNotFoundError')

          const override =
            connectorDisplayOverrides?.[trimAndLowerCase(connector?.name)] ||
            connectorDisplayOverrides?.[trimAndLowerCase(connector?.id)]

          if (override?.downloadUrl && connectorNotFoundError && typeof window !== undefined) {
            window.open(override.downloadUrl, '_newtab')
          }

          throw error
        })
      }
    }
  }
}

export function trimAndLowerCase(thing: string | undefined) {
  if (!thing) return ''

  return thing.replace(' ', '').toLowerCase()
}
