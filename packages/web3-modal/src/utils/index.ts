import { css } from 'styled-components'

import { useConnection, usePstlWeb3Modal } from '../hooks'
import { ConnectorEnhanced, DefaultWallets } from '../types'

const SOCIAL_LOGO = 'https://www.getopensocial.com/wp-content/uploads/2020/12/social-login-COLOR_2.png'
const WALLETCONNECT_LOGO =
  'https://repository-images.githubusercontent.com/204001588/a5169900-c66c-11e9-8592-33c7334dfd6d'

export function getConnectorInfo(
  connector: ConnectorEnhanced<any, any, any>,
  currentConnector: ConnectorEnhanced<any, any, any> | undefined,
  {
    connect,
    openW3Modal,
    closePstlModal,
    setW3aModalMounted,
    setW3aModalLoading
  }: {
    connect: (...params: any[]) => Promise<any>
    openW3Modal: ReturnType<typeof useConnection>[1]['openW3Modal']
    closePstlModal: ReturnType<typeof usePstlWeb3Modal>['close']
    setW3aModalMounted: (val: boolean) => void
    setW3aModalLoading: (val: boolean) => void
  },
  {
    chainId,
    address,
    isW3aModalMounted,
    closeOnConnect
  }: {
    chainId?: number
    address?: string
    isW3aModalMounted?: boolean
    closeOnConnect?: boolean
  }
): [
  { label: string; logo?: string; connected: boolean },
  ReturnType<typeof useConnection>[1]['connect'] | ReturnType<typeof useConnection>[1]['openW3Modal']
] {
  console.debug('currentConnector', currentConnector)
  switch (connector.id) {
    case DefaultWallets.WEB3AUTH:
      return [
        {
          label: connector?.customName || 'Social',
          logo: connector?.logo || SOCIAL_LOGO,
          connected: currentConnector?.id === DefaultWallets.WEB3AUTH
        },
        async () => {
          try {
            // Web3Auth modal has already mounted, skip timeout
            if (isW3aModalMounted) {
              return !address ? connect({ connector, chainId }) : openW3Modal({ route: 'Account' })
            } else {
              // Web3Auth modal is async imported on use
              // we need to wait ~20 seconds for modal to load and show loader in meantime
              setW3aModalLoading(true)

              await Promise.race([
                // timeout and thow after N seconds if we can't find the modal
                loopFindElementById('w3a-modal', 20).catch((error) => {
                  throw new Error(error)
                }),
                !address ? connect({ connector, chainId }) : openW3Modal({ route: 'Account' })
              ])
            }
          } catch (error) {
            await connector.disconnect()
            console.error('[PstlWeb3ConnectionModal::getProviderInfo] - Error in loading modal:', error)
          } finally {
            closeOnConnect && closePstlModal()
            setW3aModalLoading(false)
            setW3aModalMounted(true)
          }
        }
      ]
    case DefaultWallets.WEB3MODAL: {
      return [
        {
          label: connector?.customName || 'Wallets',
          logo: connector?.logo || WALLETCONNECT_LOGO,
          connected: !!currentConnector && currentConnector?.id !== DefaultWallets.WEB3AUTH
        },
        async () => {
          try {
            return openW3Modal({ route: !!address ? 'Account' : 'ConnectWallet' })
          } catch (error) {
            console.error('[PstlWeb3ConnectionModal::getConnectorInfo] Web3Modal error!', error)
          } finally {
            closeOnConnect && closePstlModal()
          }
        }
      ]
    }
    default:
      return [
        {
          label: connector?.customName || connector?.name || connector?.id || 'Unknown option',
          logo: connector?.logo || WALLETCONNECT_LOGO,
          connected: currentConnector?.id === connector.id
        },
        async () => {
          try {
            return !address ? connect({ connector, chainId }) : openW3Modal({ route: 'Account' })
          } catch (error) {
            console.error('[PstlWeb3ConnectionModal::getConnectorInfo] WalletConnect error!', error)
          } finally {
            closeOnConnect && closePstlModal()
          }
        }
      ]
  }
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
      result = await delayWithCondition({ value, limit, id }).catch(() => {
        throw '[loopFindElementById] Timeout searching for w3a-modal.'
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
        top: 0.5rem;
        left: 0.5rem;
      `
    case 'bottom-left':
      return css`
        bottom: 0.5rem;
        left: 0.5rem;
      `
    case 'bottom-right':
      return css`
        bottom: 0.5rem;
        right: 0.5rem;
      `
    default:
      return css`
        top: 0.5rem;
        right: 0.5rem;
      `
  }
}
