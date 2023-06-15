import { Column, Row } from '@past3lle/components'
import { upToExtraSmall, upToSmall } from '@past3lle/theme'
import styled from 'styled-components'

import { ThemedButtonActions, ThemedButtonExternalLink } from '../../Common/Button'
import { AutoColorHeader, BlackHeader } from '../../Common/Text'

export const SkillStatusLabel = styled(AutoColorHeader)``
export const SkillRarityLabel = styled(BlackHeader)<{ border?: string }>`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-style: unset;
  ${({ border }) => border && `border: ${border};`}
  > strong {
    font-variation-settings: 'wght' 450;
    letter-spacing: -1.5px;
  }
`

export const SkillsRowContainer = styled(Row)`
  position: relative;
  z-index: 1;
  padding-right: 4rem;
`
export const ActiveSkillPanelContainer = styled(Column)`
  height: 100%;

  padding: 0 4rem;
  overflow-y: auto;
  overflow-x: hidden;

  ${SkillStatusLabel}, ${SkillRarityLabel} {
    width: inherit;
    font-size: 2.5rem;
    padding: 0.5rem 1.5rem 0.5rem 0.8rem;
  }

  ${upToExtraSmall`
    padding: 0 2rem;
  `}

  ${upToSmall`
    ${SkillStatusLabel}, ${SkillRarityLabel} {
        font-size: 2rem;
    }
  `}

  ${Row}#skill-image-and-store-button {
    > img {
      max-width: 40%;
    }
    > ${ThemedButtonExternalLink}, > ${ThemedButtonActions} {
      padding: 1.5rem;
      > * {
        font-size: 2rem;

        ${upToSmall`
          font-size: 1.8rem;
        `}
      }
    }
  }
`

export const RequiredDepsContainer = styled(Column)<{ borderRadius?: string; background?: string }>``
