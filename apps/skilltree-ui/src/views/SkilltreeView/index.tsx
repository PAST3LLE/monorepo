import { SkillsCanvas } from '../../components/Skills/SkillsCanvas'
import { ArticleFadeIn } from '@past3lle/components'
import { Header } from 'components/Layout/Header'
import React from 'react'
import styled from 'styled-components/macro'

const StyledMain = styled(ArticleFadeIn)`
  // TOOD: remove - testing to see main boundaries
  margin: 2rem;
  background: rgba(0, 0, 0, 0.4);
`
const Main = () => (
  <StyledMain>
    <SkillsCanvas />
  </StyledMain>
)

export function SkilltreeView() {
  return (
    <>
      <Header />
      <Main />
    </>
  )
}
