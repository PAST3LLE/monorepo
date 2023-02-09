import { SkillsCanvas } from '../../components/Skills/SkillsCanvas'
import { ArticleFadeIn, Row } from '@past3lle/components'
import { Header } from 'components/Layout/Header'
import { ActiveSkillPanel } from 'components/Skills/ActiveSkillPanel'
import { ActiveSkillContainer } from 'components/Skills/ActiveSkillPanel/styleds'
import { SkillCanvasContainer } from 'components/Skills/SkillsCanvas/styleds'
import React from 'react'
import { useSkillsAtom } from 'state/Skills'
import styled from 'styled-components/macro'

const StyledMain = styled(ArticleFadeIn)`
  background: rgba(0, 0, 0, 0.4);
`
const Main = () => (
  <StyledMain>
    <SkilltreeBoard />
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

function SkilltreeBoard() {
  const [state, setState] = useSkillsAtom()
  return (
    <SkilltreeBoardContainer active={!!state.active}>
      <SkillsCanvas />
      {/* ACTIVE SKILLS PANEL */}
      <ActiveSkillPanel skillState={state} setSkillState={setState} />
    </SkilltreeBoardContainer>
  )
}

const SkilltreeBoardContainer = styled(Row)<{ active: boolean }>`
  height: 100%;
  width: 100%;

  > ${SkillCanvasContainer} {
    width: ${({ active }) => (active ? '60%' : '100%')};
    overflow-x: auto;
  }
  > ${ActiveSkillContainer} {
    height: 100%;
    width: 40%;
  }
`
