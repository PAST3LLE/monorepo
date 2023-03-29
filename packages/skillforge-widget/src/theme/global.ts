import { ipfsToImageUri } from '@past3lle/skillforge-web3'
import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import { useMemo } from 'react'
import { createGlobalStyle } from 'styled-components'

import { EMPTY_SKILL_IMAGE_HASH_LIST } from '../constants/skills'
import { useAssetsMap } from './utils'

export function useGenericImageSrcSet() {
  const assetsMap = useAssetsMap()
  return useMemo(
    () => ({
      TEXTURE_BG_URL_MAP: urlToSimpleGenericImageSrcSet(ipfsToImageUri(EMPTY_SKILL_IMAGE_HASH_LIST[0])),
      BACKGROUND_IMAGE_DDPX_URL_MAP:
        assetsMap.images.background.app && urlToSimpleGenericImageSrcSet(assetsMap.images.background.app),
      BG_LOGO_DDPX_URL_MAP: urlToSimpleGenericImageSrcSet(assetsMap.logos.company.full),
      SPRAY_ACCOUNT_DDPX_URL_MAP:
        assetsMap.images.skills?.skillpoint?.highlight &&
        urlToSimpleGenericImageSrcSet(assetsMap.images.skills.skillpoint.highlight)
    }),
    [assetsMap.images.background.app, assetsMap.images.skills?.skillpoint?.highlight, assetsMap.logos.company.full]
  )
}

export const CustomStaticGlobalCss = createGlobalStyle<{ backgroundImage?: string; lockedSkillIcon: string }>`
  .disabled, :disabled {
    cursor: ${({ lockedSkillIcon }) => `url(${lockedSkillIcon}), not-allowed`};
  }
  
  body > div#root {
    ${({ backgroundImage }) => backgroundImage && `background: url(${backgroundImage}) center/cover no-repeat;`}
    height: 100vh;
    display: flex;
    width: 100%;
    
    > nav {
      min-width: 12rem;
      width: auto;
    }
  }
`

export const CustomThemeGlobalCss = createGlobalStyle`
  color: ${({ theme }) => theme.mainText};
  header, nav, footer {
    background-color: ${({ theme }) => theme.mainBg};
  }
`
