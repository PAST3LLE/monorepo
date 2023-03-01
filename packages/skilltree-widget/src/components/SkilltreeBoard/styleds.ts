import { Row } from '@past3lle/components'
import styled from 'styled-components'
import { SkillCanvasContainer } from '../SkillsCanvas/styleds'

export const SkilltreeBoardContainer = styled(Row)<{ active: boolean }>`
  height: 100%;
  width: 100%;

  > ${SkillCanvasContainer} {
    width: ${({ active }) => (active ? '60%' : '100%')};
    overflow-x: auto;
  }
`