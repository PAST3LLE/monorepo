import { SkillsCanvas } from '../../components/Skills/SkillsCanvas'
import { BlackBoldItalic, BlackHeader } from '../../components/Text'
import { ArticleFadeIn, AutoRow, ExternalLink, Header as HeaderPstl, Pastellecon, Row } from '@past3lle/components'
import { SHOP_URL } from 'constants/index'
import React from 'react'
import styled from 'styled-components/macro'

const Skilltreecon = styled(Pastellecon)`
  filter: invert(1);
  margin-bottom: -25px;
  z-index: -1;
  transform: rotate(-11deg);
  position: absolute;
  top: -16px;
  left: -20px;
  width: 70%;
`

const LogoHeader = styled(BlackHeader)`
  position: relative;
  z-index: 1;
  color: ghostwhite;
  text-shadow: 4px 2px 3px #00000091;
`
const Header = () => (
  <HeaderPstl>
    <Row gap="1rem" height="100%">
      <LogoHeader>
        <Skilltreecon /> SKILLTREE
      </LogoHeader>
      <AutoRow display={'inline-flex'} backgroundColor={'ghostwhite'} padding={'1rem'}>
        <BlackBoldItalic fontSize={'1.5rem'}>
          ACQUIRE NEW SKILL IN{' '}
          <ExternalLink color="red" href={SHOP_URL}>
            THE FORGE
          </ExternalLink>{' '}
          AND UPGRADE THEM HERE
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
