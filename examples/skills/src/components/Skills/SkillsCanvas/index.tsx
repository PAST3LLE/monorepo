import { Row } from '@past3lle/components'
import * as React from 'react'
import styled from 'styled-components'

import { LightningCanvas } from '../../../components/Canvas'
import { SkillColumn } from '../SkillsColumn'

const StyledSkillColumn = styled(SkillColumn)``
const SkilltreeCanvasContainer = styled(Row)`
  position: relative;
  padding: 2rem;
  height: 100%;
  > ${StyledSkillColumn} {
    width: auto;
    margin: auto;
    z-index: 1;
  }
`

export function SkillsCanvas() {
  return (
    <SkilltreeCanvasContainer>
      <StyledSkillColumn header="i" /* alignItems="flex-start" */ />
      <StyledSkillColumn header="ii" />
      <StyledSkillColumn header="iii" /* alignItems="flex-end" */ />
      {/* CANVAS */}
      <LightningCanvas />
    </SkilltreeCanvasContainer>
  )
}
