import { ThemedButton } from '.'
import { ExternalLink } from '@past3lle/components'
import SHIRT from 'assets/png/icons/pixelated-shirt.png'
import { CursiveMonoHeaderProps, CursiveMonoHeader } from 'components/Text'
import { SHOP_URL } from 'constants/index'
import React from 'react'
import { CUSTOM_THEME } from 'theme/customTheme'
import { TEXTURE_BG_URL_MAP } from 'theme/global'

export const ShopExternalLinkButton = ({
  className,
  capitalLetterProps,
  restWordProps
}: {
  className?: string
  capitalLetterProps?: CursiveMonoHeaderProps['capitalLetterProps']
  restWordProps?: CursiveMonoHeaderProps['restWordProps']
}) => (
  <ExternalLink href={SHOP_URL} style={{ textDecoration: 'none', height: '80%', letterSpacing: '-1.6px' }}>
    <ThemedButton
      bgColor={'black'}
      bgImage={TEXTURE_BG_URL_MAP}
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
          color: CUSTOM_THEME.mainFg,
          fontFamily: 'monospace',
          fontSize: '1.8rem',
          letterSpacing: '-1.4px',
          fontStyle: 'normal',
          fontWeight: 300,
          ...restWordProps
        }}
      />
      <img src={SHIRT} style={{ maxWidth: '2.3rem' }} />
    </ThemedButton>
  </ExternalLink>
)
