import { SkillsCanvas } from '../../components/Skills/SkillsCanvas'
import { ArticleFadeIn } from '@past3lle/components'
import { Header } from 'components/Layout/Header'
import React from 'react'
import styled from 'styled-components/macro'

const StyledMain = styled(ArticleFadeIn)`
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
