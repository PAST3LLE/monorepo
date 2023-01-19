import { createGlobalStyle } from 'styled-components'
import { transparentize } from 'polished'

import { CommonGlobalCssSnippet, CssResetSnippet } from './snippets'

export const StaticGlobalCssProvider = createGlobalStyle`
  ${CssResetSnippet}
  ${CommonGlobalCssSnippet}
`

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
`
