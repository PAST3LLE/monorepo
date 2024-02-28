import React from 'react'

import { MissingChainIcon } from '../../MissingChainIcon'
import { ModalId } from '../common/types'
import { AccountLogosRow } from './styled'

interface LogoProps {
  title: string
  icon?: string
}
interface Props {
  wallet: LogoProps
  chain: LogoProps
}
const walletLogoStyles = {
  marginLeft: 'auto',
  maxWidth: 110,
  borderRadius: '5rem',
  overflow: 'hidden',
  zIndex: 1
}
const _getChainIconStyles = (walletLogo?: string) => ({
  marginLeft: walletLogo ? -27.5 : 'auto',
  maxWidth: 110,
  borderRadius: '5rem'
})

export function WalletChainIcons({ wallet, chain }: Props) {
  const chainIconStyles = _getChainIconStyles(wallet?.icon)
  return (
    <AccountLogosRow id={`${ModalId.ACCOUNT}__provider-network-logos`}>
      {wallet?.icon && <img title={wallet.title} src={wallet.icon} style={walletLogoStyles} />}

      {chain?.icon ? (
        <img src={chain.icon} title={chain.title} style={chainIconStyles} />
      ) : (
        <MissingChainIcon style={{ ...chainIconStyles, boxSizing: 'content-box', height: 'calc(100% - 2rem)' }} />
      )}
    </AccountLogosRow>
  )
}
