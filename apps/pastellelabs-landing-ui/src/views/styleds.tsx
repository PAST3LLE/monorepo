import { ColumnCenter, Text } from '@past3lle/components'
import { setBackgroundWithDPI, upToSmall, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import SplashImg from 'assets/png/footer.png'
import styled, { css } from 'styled-components/macro'
import { DIMENSIONS_MAP } from 'theme/dimensions'

export const HugeHeader = styled(Text.LargeHeader)`
  font-size: 5rem;
  font-weight: 200;
`

export const Wrapper = styled(ColumnCenter)<{ bgImage?: string; withHeader?: boolean }>`
  ${({ theme, bgImage }) =>
    bgImage &&
    css`
      ${setBackgroundWithDPI(theme, urlToSimpleGenericImageSrcSet(bgImage))}
    `}
  width: 100vw;
  min-height: 100vh;
  gap: 2rem;
  justify-content: center;

  ${upToSmall`
    justify-content: flex-start;
  `}

  > *:not(header) {
    padding: 2rem;
    ${upToSmall`
        padding: 1rem;
    `}
  }
  > header {
    height: ${DIMENSIONS_MAP.header.height};
    ${upToSmall`
        display: none;
    `}
  }
`

export const SplashWrapper = styled(Wrapper)`
  ${({ theme }) =>
    css`
      ${setBackgroundWithDPI(theme, [urlToSimpleGenericImageSrcSet(SplashImg)], {
        backgroundAttributes: ['bottom/140% no-repeat']
      })}
    `}
`

export const GridColumnWrapper = styled(ColumnCenter)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  align-content: center;

  ${upToSmall`
      align-items: flex-start;
  `}
`

export const IconContainer = styled(ColumnCenter)`
  height: 80%;

  display: grid;
  grid-template-rows: 0px 230px min-content 80px;
  align-items: start;
  justify-content: space-evenly;
  gap: 2rem;

  text-align: center;

  picture {
    align-items: flex-end;
    width: 100%;
    margin: auto;
  }

  ${upToSmall`
        grid-template-rows: 0px auto min-content auto;
        gap: 1.5rem;
        picture {
            width: 17vw;
          }
    `}
`
