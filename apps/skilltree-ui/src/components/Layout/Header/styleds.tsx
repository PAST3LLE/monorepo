import { Web3InfoContainer } from '../common'
import { ExternalLink, Header as PstlHeader, Pastellecon, Row } from '@past3lle/components'
import { MediaWidths, MEDIA_WIDTHS, setBackgroundWithDPI, upToExtraSmall, upToSmall } from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'
import HEADER_PNG from 'assets/png/header_bg.png'
import FOOD from 'assets/png/icons/icons8-food-as-resources-100.png'
import MENU_BUTTON from 'assets/png/icons/icons8-treasure-chest-90-green.png'
import { ThemedButton } from 'components/Button'
import { BlackHeader, CursiveHeader, CursiveMonoHeader, CursiveMonoHeaderProps } from 'components/Text'
import { SHOP_URL } from 'constants/urls'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components/macro'
import { CUSTOM_THEME } from 'theme/customTheme'

export const Skilltreecon = styled(Pastellecon)`
  filter: invert(1);
  margin-bottom: -25px;
  z-index: -1;
  transform: rotate(-11deg);
  position: absolute;
  top: -23px;
  left: -8px;
  width: 70%;
`

export const LogoHeader = styled(BlackHeader)`
  position: relative;
  z-index: 1;
  color: ghostwhite;
  text-shadow: 4px 2px 3px #00000091;
  max-width: 27rem;
`

export const CheckoutForge = ({
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
      bgColor={CUSTOM_THEME.logo.altBgLight}
      className={className}
      title={'Click to view skills inventory and account information'}
      display="flex"
      alignItems="center"
      gap="0 1rem"
      height="100%"
    >
      <CursiveMonoHeader
        text={'Store'}
        capitalLetterProps={{
          display: 'inline-flex',
          alignItems: 'center',
          color: CUSTOM_THEME.logo.altBg,
          fontSize: '4rem',
          zIndex: 3,
          ...capitalLetterProps
        }}
        restWordProps={{
          marginLeft: '-0.2rem',
          color: CUSTOM_THEME.logo.altBg,
          fontFamily: 'monospace',
          fontSize: '1.8rem',
          letterSpacing: '-1.4px',
          fontStyle: 'normal',
          fontWeight: 300,
          ...restWordProps
        }}
      />
      <img src={FOOD} style={{ maxWidth: '2.3rem' }} />
    </ThemedButton>
  </ExternalLink>
)
const getBaseBgProps = (theme: DefaultTheme) => ({
  preset: 'header' as const,
  skipIk: true,
  backgroundBlendMode: 'unset',
  backgroundAttributes: ['0px 0px/contain no-repeat'],
  backgroundColor: theme.logo.mainBgLight
})
const HeaderBgImgSet: GenericImageSrcSet<number> = {
  defaultUrl: HEADER_PNG,
  [MEDIA_WIDTHS.upToExtraSmall]: { '1x': HEADER_PNG },
  [MEDIA_WIDTHS.upToSmall]: { '1x': HEADER_PNG },
  [MEDIA_WIDTHS.upToMedium]: { '1x': HEADER_PNG },
  [MEDIA_WIDTHS.upToLarge]: { '1x': HEADER_PNG },
  [MEDIA_WIDTHS.upToExtraLarge]: { '1x': HEADER_PNG }
}
export const HeaderContainer = styled(PstlHeader)<{ isOpen?: boolean }>`
  min-height: 8rem;
  height: auto;
  padding: 1.5rem 2.5rem 0;

  ${({ theme }) =>
    setBackgroundWithDPI(theme, [HeaderBgImgSet] as GenericImageSrcSet<MediaWidths>[], {
      ...getBaseBgProps(theme),
      backgroundAttributes: ['0px 0px/contain no-repeat']
    })}

  ${({ theme }) => upToExtraSmall`
      ${setBackgroundWithDPI(theme, [HeaderBgImgSet] as GenericImageSrcSet<MediaWidths>[], {
        ...getBaseBgProps(theme),
        backgroundAttributes: ['0px 0px/cover no-repeat']
      })}
    `}

  > ${Row} {
    > ${LogoHeader} {
      > ${Skilltreecon} {
        width: 30%;
        opacity: 0.82;
      }
    }
    > ${Web3InfoContainer} {
      display: flex;
      margin-left: auto;
      > ${Row} {
        margin: 0.5rem;
        width: auto;
        height: 52px;
        gap: 0 2rem;
      }
    }
  }

  ${({ isOpen }) => upToSmall`
    min-height: 6rem;
    padding: 0;

  > ${Row} > ${LogoHeader} {
    width: 100%;
    padding: 0.5rem;
    margin-left: 1rem;

    > ${Skilltreecon} {
      display: none;
    }
    > ${Row} {
      display: inline-flex;
      width: 100%;
      margin-left: 0rem;

      ${CursiveHeader} {
        width: auto;
        font-size: 5rem;
      }
      > div:last-child {
        z-index: -1;
        width: auto;
      }
    }
  }

    > ${Row} > ${Web3InfoContainer} {
      // display: none;
      width: 45px;
      height: 45px;
      margin-right: 1rem;
      background: url(${MENU_BUTTON}) center/cover no-repeat;

      > ${Row} {
        ${!isOpen && 'display: none;'}
        overflow: hidden;
      }
    }
  `}
`
