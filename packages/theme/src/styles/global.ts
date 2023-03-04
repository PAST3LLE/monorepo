import { createGlobalStyle } from 'styled-components'

import { CommonGlobalCssSnippet, CssResetSnippet } from './snippets'

/**
 * @name StaticGlobalCssProvider
 * @description Static global CSS, can be placed either as a child of the @ThemeProvider or outside
 */
export const StaticGlobalCssProvider = createGlobalStyle`
  ${CssResetSnippet}
  ${CommonGlobalCssSnippet}
`

/**
 * @name ThemedGlobalCssProvider
 * @description Dynamic global CSS, MUST be placed as a child of the ThemeProvider
 */
export const ThemedGlobalCssProvider = createGlobalStyle`
  * {
    &::-webkit-scrollbar-thumb {
      background: transparent;
    }
  }

  body {
    background-image: radial-gradient(50% 50% at 50% 50%, rgb(49 5 33) 0%, rgb(2 2 2) 100%);

    transition: background-color, background-image, color 0.3s ease-in-out;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      > div#root {
        grid-template-areas:  'header header'
                              'main main'
                              'footer footer';
                              
        > nav {
          display: none;
        }
      }
    `}
  }

  html,body {
    ${({ theme }) => theme.fromMediaWidth.fromExtraLarge`
      font-size: 0.5vw;
    `}
  }

  a {
    color: #2172E5;
  }
`
