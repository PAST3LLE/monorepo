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

export const CustomStaticGlobalCss = createGlobalStyle`
  img, svg, video, picture {
    max-inline-size: revert;
    max-block-size: revert;
  }
  
  body > div#root {
    height: 100vh;
    display: flex;
    width: 100%;
    
    > nav {
      min-width: 12rem;
      width: auto;
    }
  }
`

export const CustomThemeGlobalCss = createGlobalStyle<{
  backgroundImage?: BackgroundPropertyFull
  lockedSkillIcon: string
}>`
  .disabled, :disabled {
    cursor: ${({ lockedSkillIcon }) => `url(${lockedSkillIcon}), not-allowed`};
  }
  
  color: ${({ theme }) => theme.mainText};
  header, nav, footer {
    background-color: ${({ theme }) => theme.mainBg};
  }
  ${({ backgroundImage, theme }) =>
    backgroundImage && setBackgroundOrDefault(theme, { bgValue: backgroundImage, defaultValue: 'transparent' })};
`
