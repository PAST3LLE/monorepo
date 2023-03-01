import { Web3InfoContainer } from '../common'
import { Header as PstlHeader, Row } from '@past3lle/components'
import { MediaWidths, MEDIA_WIDTHS, setBackgroundWithDPI, upToExtraSmall, upToSmall } from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'
import HEADER_PNG from 'assets/png/header_bg.png'
import MENU_BUTTON from 'assets/png/icons/icons8-treasure-chest-90-green.png'
import styled, { DefaultTheme } from 'styled-components/macro'

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
