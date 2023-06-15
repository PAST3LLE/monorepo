import { Column, RowCenter, Text } from '@past3lle/components'
import { upToExtraSmall } from '@past3lle/theme'
import styled from 'styled-components'

import { ThemedButtonActions } from '../../Common/Button'
import { ActiveSkillPanelContainer, SkillRarityLabel, SkillsRowContainer } from '../ActiveSkillPanel/styleds'

export const TradeAndUnlockPanelContainer = styled(ActiveSkillPanelContainer)`
  ${SkillsRowContainer} {
    ${SkillRarityLabel} {
      font-size: 1.5rem;
      margin: -2.5rem 0 0 0;
      padding: 0rem 0.5rem 0rem 0.5rem;
      border-radius: 0 0 0.7rem 0.7rem;
      z-index: 10;
    }
  }

  ${Column} {
    ${ThemedButtonActions} {
      > ${Text.Black} {
        font-size: 1.8rem;
      }
    }
  }

  ${Column} > ${SkillRarityLabel} {
    width: 100%;
  }
`

export const SkillTradeExpandingContainer = styled(RowCenter)<{ showHover?: boolean }>`
  justify-content: space-between;
  width: 100%;
  gap: 2rem;
  border-radius: 0.7rem;
  overflow: hidden;
  min-height: 6rem;
  padding: 0 1rem;

  ${upToExtraSmall`
    padding: 0;
  `}

  ${({ showHover }) =>
    showHover &&
    `&:hover {
    min-height: 12rem;
    overflow: auto;
  }`}

  transition: min-height 0.3s ease-in-out;
`
