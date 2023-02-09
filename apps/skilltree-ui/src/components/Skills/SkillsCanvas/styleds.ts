import { Column } from '@past3lle/components'
import styled from 'styled-components/macro'

export const SkillCanvasContainer = styled(Column).attrs((props) => ({
  ...props,
  height: '100%',
  position: 'relative'
}))`
  width: 100%;
`
