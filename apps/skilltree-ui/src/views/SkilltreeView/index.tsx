import { SkillsCanvas } from '../../components/Skills/SkillsCanvas'
import { ArticleFadeIn, Row } from '@past3lle/components'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import { Footer } from 'components/Layout/Footer'
import { Header } from 'components/Layout/Header'
import { SkillCanvasContainer } from 'components/Skills/SkillsCanvas/styleds'
import React from 'react'
import { useSkillsAtom } from 'state/Skills'
import { useGetWindowSize } from 'state/WindowSize'
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
  const [{ width = 0 }] = useGetWindowSize()
  return (
    <>
      <Header />
      <Main />
      {width < MEDIA_WIDTHS.upToSmall && <Footer />}
    </>
  )
}

function SkilltreeBoard() {
  const [state] = useSkillsAtom()
  return (
    <SkilltreeBoardContainer active={!!state.active[0]}>
      <SkillsCanvas />
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
`
