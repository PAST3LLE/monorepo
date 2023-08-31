import React from 'react'

import { NoChainLogo } from '../../NoChainLogo'
import { ModalId } from '../common/types'
import { AccountLogosRow } from './styled'

interface LogoProps {
  title: string
  logo?: string
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
const _getChainLogoStyles = (walletLogo?: string) => ({
  marginLeft: walletLogo ? -27.5 : 'auto',
  maxWidth: 110,
  borderRadius: '5rem'
})

export function WalletChainLogos({ wallet, chain }: Props) {
  const chainLogoStyles = _getChainLogoStyles(wallet?.logo)
  return (
    <AccountLogosRow id={`${ModalId.ACCOUNT}__provider-network-logos`}>
      {wallet?.logo && <img title={wallet.title} src={wallet.logo} style={walletLogoStyles} />}

      {!chain?.logo ? (
        <img src={chain.logo} title={chain.title} style={chainLogoStyles} />
      ) : (
        <NoChainLogo style={{ ...chainLogoStyles, width: 50, padding: 0 }} />
      )}
    </AccountLogosRow>
  )
}
