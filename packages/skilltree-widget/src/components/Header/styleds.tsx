import { Header as PstlHeader, Row } from '@past3lle/components'
import { setBackgroundWithDPI, upToExtraSmall, upToSmall, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import styled, { DefaultTheme } from 'styled-components'

export const Web3InfoContainer = styled(Row)`
  position: relative;
  justify-content: flex-end;
  width: auto;
  gap: 1rem;
`

const getBaseBgProps = (theme: DefaultTheme) => ({
  preset: 'header' as const,
  skipIk: true,
  backgroundBlendMode: 'unset',
  backgroundAttributes: ['0px 0px/contain no-repeat'],
  backgroundColor: theme.mainBgAlt
})

export const HeaderContainer = styled(PstlHeader)<{ isOpen?: boolean }>`
  min-height: 8rem;
  height: auto;
  padding: 1.5rem 2.5rem 0;

  ${({ theme }) =>
    theme.assetsMap.images.headerBackground &&
    setBackgroundWithDPI(theme, [urlToSimpleGenericImageSrcSet(theme.assetsMap.images.headerBackground)], {
      ...getBaseBgProps(theme),
      backgroundAttributes: ['0px 0px/contain no-repeat']
    })}

  ${({ theme }) =>
    theme.assetsMap.images.headerBackground &&
    upToExtraSmall`
      ${setBackgroundWithDPI(theme, [urlToSimpleGenericImageSrcSet(theme.assetsMap.images.headerBackground)], {
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

  ${({ theme, isOpen }) => upToSmall`
    min-height: 6rem;
    padding: 0;

    > ${Row} > ${Web3InfoContainer} {
      // display: none;
      width: 45px;
      height: 45px;
      margin-right: 1rem;
      background: url(${theme.assetsMap.icons.inventory}) center/cover no-repeat;

      > ${Row} {
        ${!isOpen && 'display: none;'}
        overflow: hidden;
      }
    }
  `}
`
