import { BackgroundPropertyFull, getProperBackgroundType, setBackgroundOrDefault } from '@past3lle/theme'
import { useMemo } from 'react'
import { createGlobalStyle } from 'styled-components'

import { useAssetsMap } from './utils'

export function useGenericImageSrcSet() {
  const assetsMap = useAssetsMap()
  return useMemo(
    () => ({
      EMPTY_SKILL_DDPX_URL_MAP: getProperBackgroundType(assetsMap.images.skills?.skillpoint?.empty),
      BACKGROUND_IMAGE_DDPX_URL_MAP: getProperBackgroundType(assetsMap.images.background.app),
      BG_LOGO_DDPX_URL_MAP: getProperBackgroundType(assetsMap.logos.company.full),
      SPRAY_ACCOUNT_DDPX_URL_MAP: getProperBackgroundType(assetsMap.images.skills?.skillpoint?.highlight)
    }),
    [
      assetsMap.images.background.app,
      assetsMap.images.skills?.skillpoint?.highlight,
      assetsMap.images.skills?.skillpoint?.empty,
      assetsMap.logos.company.full
    ]
  )
}

export const CustomStaticGlobalCss = createGlobalStyle<{
  backgroundImage?: BackgroundPropertyFull
  lockedSkillIcon: string
}>`
  .disabled, :disabled {
    cursor: ${({ lockedSkillIcon }) => `url(${lockedSkillIcon}), not-allowed`};
  }
  
  body > div#root {
    height: 100vh;
    display: flex;
    width: 100%;
    
    > nav {
      min-width: 12rem;
      width: auto;
    }
    ${({ backgroundImage, theme }) =>
      backgroundImage && setBackgroundOrDefault(theme, { bgValue: backgroundImage, defaultValue: 'transparent' })};
  }
`

export const CustomThemeGlobalCss = createGlobalStyle`
  color: ${({ theme }) => theme.mainText};
  header, nav, footer {
    background-color: ${({ theme }) => theme.mainBg};
  }
`
