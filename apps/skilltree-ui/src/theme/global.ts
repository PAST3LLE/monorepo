import BG_IMAGE from '../assets/png/background.png'
import { createGlobalStyle } from 'styled-components/macro'

export const CustomStaticGlobalCss = createGlobalStyle`
  body > div#root {
    background: url(${BG_IMAGE}) center/cover no-repeat;
    height: 100vh;

    > header {
      min-height: 8rem;
      height: auto;
      padding: 0 2rem;
    }
    > nav {
      min-width: 12rem;
      width: auto;
    }
  }
`

export const CustomThemeGlobalCss = createGlobalStyle`
  color: ${({ theme }) => theme.text1};
  header, nav, footer {
    background-color: ${({ theme }) => theme.bg1};
  }
`
