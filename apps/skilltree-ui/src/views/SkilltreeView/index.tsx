import { SkillsCanvas } from '../../components/Skills/SkillsCanvas'
import { BlackBoldItalic, BlackHeader } from '../../components/Text'
import { ArticleFadeIn, AutoRow, ExternalLink, Header as HeaderPstl, Pastellecon, Row } from '@past3lle/components'
import { SHOP_URL } from 'constants/index'
import React from 'react'
import styled from 'styled-components/macro'

const Skilltreecon = styled(Pastellecon)`
  margin-bottom: -20px;
  z-index: 1;
  position: relative;
  height: 50px;
`

const Header = () => (
  <HeaderPstl>
    <Row gap="1rem" height="100%">
      <BlackHeader>
        <Skilltreecon /> SKILLS
      </BlackHeader>
      <AutoRow display={'inline-flex'} backgroundColor={'ghostwhite'} padding={'1rem'}>
        <BlackBoldItalic fontSize={'1.5rem'}>
          ACQUIRE NEW SKILL IN <ExternalLink href={SHOP_URL}>THE FORGE</ExternalLink> AND UPGRADE THEM HERE
        </BlackBoldItalic>
      </AutoRow>
    </Row>
  </HeaderPstl>
)

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
