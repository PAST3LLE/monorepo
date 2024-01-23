import { StyledLink } from '@past3lle/components'
import React from 'react'

import { SHOP_URL } from '../../../constants/index'
import { useGenericImageSrcSet } from '../../../theme/global'
import { HeaderButton } from './common'

export const ShopExternalLinkButton = () => {
  const { EMPTY_SKILL_DDPX_URL_MAP } = useGenericImageSrcSet()
  return (
    <StyledLink href={SHOP_URL} style={{ textDecoration: 'none', height: '80%', letterSpacing: '-1.6px' }}>
      <HeaderButton
        iconKey="shop"
        bgImage={EMPTY_SKILL_DDPX_URL_MAP ?? null}
        fullHeader="Store"
        title={'Click to view skills inventory and account information'}
        height="100%"
      />
    </StyledLink>
  )
}
