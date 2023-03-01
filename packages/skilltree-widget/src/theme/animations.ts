import { css } from 'styled-components'

export const flashingTextAnimation = css`
  @keyframes flashingText {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 0.5;
    }
  }
`
