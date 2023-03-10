import { ArticleFadeIn, ColumnCenter } from '@past3lle/components'
import React from 'react'
import styled from 'styled-components'

import { SkillForgeComponent } from '../components'
import { SkillForgeHeader } from '../components/Header'

const StyledMain = styled(ArticleFadeIn)`
  background: rgba(0, 0, 0, 0.4);
`
const SkillForgeContainer = styled(ColumnCenter)`
  position: relative;
  width: 100%;
  height: 100%;
`

const Main = () => (
  <StyledMain>
    <SkillForgeComponent />
  </StyledMain>
)

export function SkillForgeConnected() {
  return (
    <SkillForgeContainer>
      <SkillForgeHeader />
      <Main />
    </SkillForgeContainer>
  )
}
