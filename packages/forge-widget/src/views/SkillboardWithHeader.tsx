import { ArticleFadeIn, ColumnCenter } from '@past3lle/components'
import React from 'react'
import styled from 'styled-components'

import { SkilltreeComponent } from '../components'
import { SkilltreeHeader } from '../components/Header'

const StyledMain = styled(ArticleFadeIn)`
  background: rgba(0, 0, 0, 0.4);
`
const SkilltreeContainer = styled(ColumnCenter)`
  position: relative;
  width: 100%;
  height: 100%;
`

const Main = () => (
  <StyledMain>
    <SkilltreeComponent />
  </StyledMain>
)

export function SkilltreeConnected() {
  return (
    <SkilltreeContainer>
      <SkilltreeHeader />
      <Main />
    </SkilltreeContainer>
  )
}