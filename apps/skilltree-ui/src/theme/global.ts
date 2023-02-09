import { MediaWidths } from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'
import BG_IMAGE from 'assets/png/background.png'
import { createGlobalStyle, css } from 'styled-components/macro'

export const BACKGROUND_IMAGE_DDPX_URL_MAP: GenericImageSrcSet<MediaWidths> = {
  defaultUrl: BG_IMAGE,
  500: { '1x': BG_IMAGE },
  720: { '1x': BG_IMAGE },
  960: { '1x': BG_IMAGE },
  1280: { '1x': BG_IMAGE },
  1440: { '1x': BG_IMAGE }
}

// "!important" override on WalletConnect style variables
// this is ugly but currently the only way to style web3modal
const Web3ModalOverrideVariables = css`
  ${({ theme }) => `
    --w3m-color-fg-accent: ${theme.mainBg2} !important;
    // --w3m-color-bg-1: ${theme.mainBg} !important;
    --w3m-color-bg-1: ${theme.mainBgDarker} !important;
    --w3m-color-bg-2: ${theme.mainBg2} !important;
    --w3m-color-fg-1: ${theme.mainBg2} !important;
    --w3m-color-fg-2: ${theme.mainFg} !important;
    // gradients
    --gradient-1: ${theme.mainBg} !important;
    --gradient-2: ${theme.mainBg2} !important;
    --gradient-3: ${theme.mainBg} !important;
    --gradient-4: ${theme.mainBg2} !important;
`}
`

export const CustomStaticGlobalCss = createGlobalStyle`
  body > div#root {
    background: url(${BG_IMAGE}) center/cover no-repeat;
    height: 100vh;

    > header {
      min-height: 8rem;
      height: auto;
      padding: 1.5rem 2.5rem 0;
    }
    > nav {
      min-width: 12rem;
      width: auto;
    }
  }
`

export const CustomThemeGlobalCss = createGlobalStyle`
  :root {
    ${Web3ModalOverrideVariables}
  }

  color: ${({ theme }) => theme.text1};
  header, nav, footer {
    background-color: ${({ theme }) => theme.bg1};
  }
`
