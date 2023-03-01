import { MediaWidths } from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'
import { createGlobalStyle, css } from 'styled-components'

import BG_LOGO from '../assets/png/back-logo.png'
import BG_IMAGE from '../assets/png/background.png'
import LOCK from '../assets/png/icons/icons8-lock-32.png'
import SPRAY_ACCOUNT from '../assets/png/spray-account.png'
import { EMPTY_SKILL_IMAGE_HASH_LIST } from '../constants/skills'
import { ipfsToImageUri } from '../utils'
import { makeSimpleGenericImageSrcSet } from './utils'

export const TEXTURE_BG_URL_MAP: GenericImageSrcSet<MediaWidths> = makeSimpleGenericImageSrcSet(
  ipfsToImageUri(EMPTY_SKILL_IMAGE_HASH_LIST[0])
)
export const BACKGROUND_IMAGE_DDPX_URL_MAP: GenericImageSrcSet<MediaWidths> = makeSimpleGenericImageSrcSet(BG_IMAGE)
export const BG_LOGO_DDPX_URL_MAP: GenericImageSrcSet<MediaWidths> = makeSimpleGenericImageSrcSet(BG_LOGO)
export const SPRAY_ACCOUNT_DDPX_URL_MAP: GenericImageSrcSet<MediaWidths> = makeSimpleGenericImageSrcSet(SPRAY_ACCOUNT)

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
  .disabled, :disabled {
    cursor: url(${LOCK}), not-allowed;
  }
  
  body > div#root {
    background: url(${BG_IMAGE}) center/cover no-repeat;
    height: 100vh;
    
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
