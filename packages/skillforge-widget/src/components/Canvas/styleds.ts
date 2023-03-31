import { Column } from '@past3lle/components'
import styled from 'styled-components'

import { MINIMUM_BOARD_WIDTH } from '../../constants/skills'

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
  minWidth: MINIMUM_BOARD_WIDTH,
  position: 'relative'
})``
