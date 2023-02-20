import { Row, Column } from '@past3lle/components'
import { upToSmall } from '@past3lle/theme'
import { ThemedButtonExternalLink } from 'components/Button'
import { AutoColorHeader, BlackHeader } from 'components/Text'
import styled from 'styled-components/macro'

export const SkillStatusLabel = styled(AutoColorHeader)``
export const SkillRarityLabel = styled(BlackHeader)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

export const SkillsRowContainer = styled(Row)`
  position: relative;
  z-index: 1;
  padding-right: 4rem;

  > div#blur-div {
    position: absolute;
    right: 0;
    top: 0;
    width: 6rem;
    height: 100%;
    z-index: 5;
  }
`
export const ActiveSkillPanelContainer = styled(Column)`
  height: 100%;

  padding: 0 4rem;
  overflow-y: auto;
  overflow-x: hidden;

  ${SkillStatusLabel}, ${SkillRarityLabel} {
    width: inherit;
    font-size: 2.5rem;
    padding: 0.25rem 2rem;
  }

  ${upToSmall`
    ${SkillStatusLabel}, ${SkillRarityLabel} {
        font-size: 2rem;
    }
  `}

  ${Row}#skill-image-and-store-button {
    > img {
      max-width: 40%;
    }
    > ${ThemedButtonExternalLink} {
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
