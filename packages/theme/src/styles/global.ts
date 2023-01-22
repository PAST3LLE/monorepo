import { createGlobalStyle } from 'styled-components'
import { transparentize } from 'polished'

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
    background-image: ${({ theme }): string => `
      radial-gradient(
        50% 50% at 50% 50%,
        ${transparentize(0.9, theme.purple3)} 0%,
        ${transparentize(1, theme.bg1)} 100%
      );`}

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
    color: ${({ theme }) => theme.blue1};
  }
`
