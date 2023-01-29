import { SkillsCanvas } from '../../components/Skills/SkillsCanvas'
import { BlackBoldItalic, BlackHeader } from '../../components/Text'
import { ArticleFadeIn, AutoRow, Header as HeaderPstl, Row } from '@past3lle/components'
import styled from 'styled-components'

const Header = () => (
  <HeaderPstl>
    <Row gap="1rem">
      <BlackHeader>PASTELLE SKILLTREE</BlackHeader>
      <AutoRow display={'inline-flex'} backgroundColor={'ghostwhite'} padding={'1rem'}>
        <BlackBoldItalic fontSize={'1.5rem'}>
          VIEW CURRENT SKILLS AND ANY UPGRADABLES. HOVER OVER SKILL FOR MORE INFO.
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
