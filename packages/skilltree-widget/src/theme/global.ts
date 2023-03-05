import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import { useMemo } from 'react'
import { createGlobalStyle, css } from 'styled-components'

import { EMPTY_SKILL_IMAGE_HASH_LIST } from '../constants/skills'
import { ipfsToImageUri } from '../utils'
import { useAssetsMap } from './utils'

export function useGenericImageSrcSet() {
  const assetsMap = useAssetsMap()
  return useMemo(
    () => ({
      TEXTURE_BG_URL_MAP: urlToSimpleGenericImageSrcSet(ipfsToImageUri(EMPTY_SKILL_IMAGE_HASH_LIST[0])),
      BACKGROUND_IMAGE_DDPX_URL_MAP: urlToSimpleGenericImageSrcSet(assetsMap.images.appBackground),
      BG_LOGO_DDPX_URL_MAP: urlToSimpleGenericImageSrcSet(assetsMap.logos.companyMain),
      SPRAY_ACCOUNT_DDPX_URL_MAP: urlToSimpleGenericImageSrcSet(assetsMap.images.skillpointHighlight)
    }),
    [assetsMap.images.appBackground, assetsMap.images.skillpointHighlight, assetsMap.logos.companyMain]
  )
}

// "!important" override on WalletConnect style variables
// this is ugly but currently the only way to style web3modal
const Web3ModalOverrideVariables = css`
  ${({ theme }) => `
    --w3m-color-fg-accent: ${theme.mainBgAlt} !important;
    // --w3m-color-bg-1: ${theme.mainBg} !important;
    --w3m-color-bg-1: ${theme.mainBgDarker} !important;
    --w3m-color-bg-2: ${theme.mainBgAlt} !important;
    --w3m-color-fg-1: ${theme.mainBgAlt} !important;
    --w3m-color-fg-2: ${theme.mainFg} !important;
    // gradients
    --gradient-1: ${theme.mainBg} !important;
    --gradient-2: ${theme.mainBgAlt} !important;
    --gradient-3: ${theme.mainBg} !important;
    --gradient-4: ${theme.mainBgAlt} !important;
`}
`

export const CustomStaticGlobalCss = createGlobalStyle<{ backgroundImage: string; lockedSkillIcon: string }>`
  .disabled, :disabled {
    cursor: ${({ lockedSkillIcon }) => `url(${lockedSkillIcon}), not-allowed`};
  }
  
  body > div#root {
    background: ${({ backgroundImage }) => `url(${backgroundImage}) center/cover no-repeat`};
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

  color: ${({ theme }) => theme.mainText};
  header, nav, footer {
    background-color: ${({ theme }) => theme.mainBg};
  }
`
