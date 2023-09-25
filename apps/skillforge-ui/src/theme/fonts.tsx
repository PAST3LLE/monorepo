import Gothic from 'assets/fonts/GothAndGothic.otf'
import { createGlobalStyle } from 'styled-components/macro'

export const GothicFontCssProvider = createGlobalStyle`
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: normal;
        font-weight: 500;
    }
`
