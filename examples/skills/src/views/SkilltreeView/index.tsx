import { ArticleFadeIn, ColumnCenter, Header as HeaderPstl, RowStart } from '@past3lle/components'
import * as React from 'react'
import styled from 'styled-components'

import { BlackBoldItalic, BlackHeader, ThemedHeader } from '../../components/Text'
import { LightningCanvas } from '../../components/canvas'

const Header = () => (
  <HeaderPstl>
    <BlackHeader>PASTELLE SKILLTREE</BlackHeader>
  </HeaderPstl>
)

const StyledMain = styled(ArticleFadeIn)``
const Main = () => (
  <StyledMain>
    <ColumnCenter padding={'2rem'}>
      {/* TITLE */}
      <RowStart display={'inline-flex'} backgroundColor={'ghostwhite'} padding={'1rem'}>
        <BlackBoldItalic fontSize={'1.5rem'}>
          VIEW CURRENT SKILLS AND ANY UPGRADABLES. HOVER OVER SKILL FOR MORE INFO.
        </BlackBoldItalic>
      </RowStart>
      <RowStart display={'inline-flex'} backgroundColor={'ghostwhite'} margin={'2rem 0'}>
        <ThemedHeader>THEMED HEADER</ThemedHeader>
      </RowStart>
      {/* CONTENT */}
    </ColumnCenter>
    {/* CANVAS */}
    <LightningCanvas />
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
