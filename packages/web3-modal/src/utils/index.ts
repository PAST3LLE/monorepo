import { css } from 'styled-components'
import { useConnect } from 'wagmi'

import { useConnection } from '../hooks'
import { ConnectorEnhanced, DefaultWallets } from '../types'

const SOCIAL_LOGO = 'https://www.getopensocial.com/wp-content/uploads/2020/12/social-login-COLOR_2.png'
const WALLETCONNECT_LOGO =
  'https://repository-images.githubusercontent.com/204001588/a5169900-c66c-11e9-8592-33c7334dfd6d'

export function getConnectorInfo(
  connector: ConnectorEnhanced<any, any, any>,
  {
    connect,
    openW3Modal
  }: {
    connect: ReturnType<typeof useConnection>[1]['connect']
    openW3Modal: ReturnType<typeof useConnection>[1]['openW3Modal']
  }
): [{ label: string; logo?: string }, ReturnType<typeof useConnect>['connect']] {
  switch (connector.id) {
    case DefaultWallets.WEB3AUTH:
      return [
        {
          label: connector?.customName || 'Social',
          logo: connector?.logo || SOCIAL_LOGO
        },
        () => connect({ connector })
      ]
    case DefaultWallets.WEB3MODAL:
      return [
        {
          label: connector?.customName || 'Wallets',
          logo: connector?.logo || WALLETCONNECT_LOGO
        },
        () => openW3Modal({ route: 'ConnectWallet' })
      ]
    default:
      return [
        {
          label: connector?.customName || 'Unknown Option',
          logo: connector?.logo || WALLETCONNECT_LOGO
        },
        () => connect({ connector })
      ]
  }
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
