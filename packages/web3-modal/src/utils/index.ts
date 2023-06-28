import { css } from 'styled-components'

import { useConnection, usePstlWeb3Modal } from '../hooks'
import { ConnectorEnhanced, ConnectorEnhancedExtras, DefaultWallets } from '../types'

type GetConnectorInfoCallbacks = {
  connect: (...params: any[]) => Promise<any>
  openW3Modal: ReturnType<typeof useConnection>[1]['openW3Modal']
  closePstlModal: ReturnType<typeof usePstlWeb3Modal>['close']
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

export function getConnectorInfo(
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  { connect, openW3Modal, closePstlModal, setProviderModalMounted, setProviderModaLoading }: GetConnectorInfoCallbacks,
  { chainId, address, isProviderModalMounted, closeOnConnect, connectorDisplayOverrides }: GetConnectorInfoConstants
): [
  { label: string; logo?: string; connected: boolean; isRecommended?: boolean },
  ReturnType<typeof useConnection>[1]['connect'] | ReturnType<typeof useConnection>[1]['openW3Modal']
] {
  let modalType: ProviderModalType = (
    connectorDisplayOverrides?.[connector?.name] || connectorDisplayOverrides?.[connector?.id]
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
        { chainId, address, closeOnConnect, isModalMounted },
        {
          connect,
          openW3Modal,
          closePstlModal,
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
    setTimeout(() => (value >= limit ? resolve('BAILED') : resolve(document.getElementById(id))), freq)
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
  constants: Pick<GetConnectorInfoConstants, 'address' | 'chainId' | 'closeOnConnect'> & { isModalMounted?: boolean },
  callbacks: Omit<
    GetConnectorInfoCallbacks,
    'setProviderModaLoading' | 'setProviderModalMounted' | 'setW3mModalLoading' | 'setW3mModalMounted'
  > & {
    setModalLoading?: (status: boolean) => void
    setModalMounted?: (status: boolean) => void
  }
) {
  const { address, chainId, closeOnConnect, isModalMounted } = constants
  const { connect, setModalLoading, setModalMounted, closePstlModal, openW3Modal } = callbacks

  try {
    // Modal has already mounted, skip timeout
    if (isModalMounted) {
      return _handleConnectorClick(connector, currentConnector, { chainId, address }, { connect, openW3Modal })
    } else if (!!modalId) {
      // Modal is async imported on use
      // we need to wait ~20 seconds for modal to load and show loader in meantime
      setModalLoading?.(true)

      await Promise.race([
        // timeout and thow after N seconds if we can't find the modal
        loopFindElementById(modalId, 30).catch((error) => {
          throw new Error(error)
        }),
        _handleConnectorClick(connector, currentConnector, { chainId, address }, { connect, openW3Modal })
      ])
    }
  } catch (error: any) {
    await connector.disconnect()
    console.error('[PstlWeb3ConnectionModal::_getProviderInfo] - Error in loading modal:', error)
    throw new Error(error)
  } finally {
    closeOnConnect && closePstlModal()
    setModalLoading?.(false)
    setModalMounted?.(true)
  }
}

function _getProviderInfo(
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  connectorDisplayOverrides: GetConnectorInfoConstants['connectorDisplayOverrides']
) {
  const baseConnectorKey = connectorDisplayOverrides?.[connector.id] || connectorDisplayOverrides?.[connector.name]
  return {
    label: baseConnectorKey?.customName || connector.name,
    logo: baseConnectorKey?.logo || connector?.logo,
    connected: Boolean(currentConnector && currentConnector.id === connector.id),
    isRecommended: baseConnectorKey?.isRecommended
  }
}

function _handleConnectorClick(
  connector: ConnectorEnhanced<any, any>,
  currentConnector: ConnectorEnhanced<any, any> | undefined,
  { address, chainId }: Pick<GetConnectorInfoConstants, 'address' | 'chainId'>,
  { connect, openW3Modal }: Pick<GetConnectorInfoCallbacks, 'openW3Modal' | 'connect'>
) {
  const isConnectedConnector = currentConnector?.id === connector.id
  if (address && isConnectedConnector) {
    return openW3Modal({ route: 'Account' })
  } else {
    switch (connector.id) {
      case DefaultWallets.WEB3MODAL:
        return openW3Modal({ route: 'ConnectWallet' })
      default:
        return connect({ connector, chainId })
    }
  }
}
