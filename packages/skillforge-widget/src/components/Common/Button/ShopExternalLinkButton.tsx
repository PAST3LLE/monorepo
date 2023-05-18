import { ExternalLink } from '@past3lle/components'
import React from 'react'

import { ThemedButton } from '.'
import { SHOP_URL } from '../../../constants/index'
import { baseTheme } from '../../../theme/base'
import { useGenericImageSrcSet } from '../../../theme/global'
import { useAssetsMap } from '../../../theme/utils'
import { CursiveMonoHeader, CursiveMonoHeaderProps } from '../Text'

export const ShopExternalLinkButton = ({
  className,
  capitalLetterProps,
  restWordProps
}: {
  className?: string
  capitalLetterProps?: CursiveMonoHeaderProps['capitalLetterProps']
  restWordProps?: CursiveMonoHeaderProps['restWordProps']
}) => {
  const assetsMap = useAssetsMap()
  const { EMPTY_SKILL_DDPX_URL_MAP } = useGenericImageSrcSet()
  return (
    <ExternalLink href={SHOP_URL} style={{ textDecoration: 'none', height: '80%', letterSpacing: '-1.6px' }}>
      <ThemedButton
        bgColor={'black'}
        bgImage={EMPTY_SKILL_DDPX_URL_MAP ?? undefined}
        bgBlendMode="hard-light"
        className={className}
        title={'Click to view skills inventory and account information'}
        display="flex"
        alignItems="center"
        gap="0 0.5rem"
        height="100%"
      >
        <CursiveMonoHeader
          text={'Store'}
          capitalLetterProps={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#e1d4dd',
            fontSize: '4rem',
            zIndex: 3,
            ...capitalLetterProps
          }}
          restWordProps={{
            marginLeft: '-0.2rem',
            color: baseTheme.mainFg,
            fontFamily: 'monospace',
            fontSize: '1.8rem',
            letterSpacing: '-1.4px',
            fontStyle: 'normal',
            fontWeight: 300,
            ...restWordProps
          }}
        />
        <img src={assetsMap.icons.shop} style={{ maxWidth: '2.3rem' }} />
      </ThemedButton>
    </ExternalLink>
  )
}
