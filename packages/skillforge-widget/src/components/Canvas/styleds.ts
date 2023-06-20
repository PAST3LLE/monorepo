import { Column } from '@past3lle/components'
import styled from 'styled-components'

export const SkillCanvasContainer = styled(Column).attrs((props) => ({
  ...props,
  height: '100%',
  position: 'relative'
}))`
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`

export const SkillInnerCanvasContainer = styled(Column).attrs({
  height: '100%',
  width: '100%',
  position: 'relative'
})<{ minimumBoardWidth: number }>`
  min-width: ${(props) => props.minimumBoardWidth}px;
`
