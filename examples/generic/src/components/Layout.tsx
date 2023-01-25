import styled from 'styled-components'
import { ArticleFadeIn, Footer, Header, Nav } from '@past3lle/components'
import { OFF_WHITE, ThemeModes } from '@past3lle/theme'

const BLACK_TRANSPARENT = '#000007b0'
export const PstlHeader = styled(Header)`
  background-color: ${({theme: { mode }}) => mode === ThemeModes.DARK ? BLACK_TRANSPARENT : OFF_WHITE};
  min-height: 80px;
`

export const PstlNav = styled(Nav)`
  background-color: ${BLACK_TRANSPARENT};
  min-width: 115px;
`

export const PstlFooter = styled(Footer)`
  background-color: #000;
  color: #fff;
  font-size: 1.2rem;

  min-height: 190px;
  padding: 2rem;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));

  > ul {
    text-align: center;
  }
`

export const PstlMain = styled(ArticleFadeIn)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column nowrap;
`
