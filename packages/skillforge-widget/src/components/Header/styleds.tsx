import { Header as PstlHeader, Row } from '@past3lle/components'
import { setBackgroundOrDefault, upToExtraSmall, upToSmall } from '@past3lle/theme'
import styled, { DefaultTheme } from 'styled-components'

import { ThemedButton } from '../Common/Button'

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
    theme.assetsMap.images.background.header?.background &&
    setBackgroundOrDefault(
      theme,
      { bgValue: theme.assetsMap.images.background.header.background, defaultValue: 'transparent' },
      {
        ...getBaseBgProps(theme),
        backgroundAttributes: ['0px 0px/contain no-repeat']
      }
    )}

  ${({ theme }) =>
    theme.assetsMap.images.background.header?.background &&
    upToExtraSmall`
      ${setBackgroundOrDefault(
        theme,
        { bgValue: theme.assetsMap.images.background.header.background, defaultValue: 'transparent' },
        {
          ...getBaseBgProps(theme),
          backgroundAttributes: ['0px 0px/cover no-repeat']
        }
      )}
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

  ${upToSmall`
    min-height: 6rem;
    padding: 0;

    > ${Row} > ${Web3InfoContainer} {
      width: 80%;
      margin-right: 0.5rem;
      margin-left: auto;

      > ${Row} {
        gap: 1rem;
        // Inventory button
        > ${ThemedButton}:first-child {
          padding: 0 0.8rem;
        }
      }
    }
  `}
`
