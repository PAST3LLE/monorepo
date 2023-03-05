import { ThemeBaseRequired, ThemeByModes, ThemeMediaWidthsBaseRequired, ThemeMinimumRequired } from '@past3lle/theme'

import { SkillRarity } from '../types'
import { SupportedChains } from '../web3/types/chains'

type ChainsIcons = {
  readonly disconnected: string
} & {
  readonly [key in SupportedChains]: string
}

type RarityIcons = {
  readonly [key in SkillRarity]: string
}

export interface AssetsMap {
  readonly assetsMap: {
    readonly logos: {
      companyMain: string
    }
    readonly images: {
      appBackground: string
      skillpointHighlight: string
    }
    readonly icons: {
      locked: string
      connection: string
      inventory: string
      shop: string
      chains: ChainsIcons
      rarity: RarityIcons
    }
  }
}

export interface SkilltreeTheme extends AssetsMap {
  mainText: string
  darkText: string
  lightText: string
  mainBg: string
  mainBgDarker: string
  mainBgAlt: string
  mainFg: string
  mainFgAlt: string

  button: {
    mainBg: string
    mainBgLight: string
    altBg: string
    altBgLight: string
    border: { radius: string; colour: string; border: string }
    hoverColour: string
    fontSize: { small: string; normal: string; large: string }
  }
  // rarity colours
  rarity: {
    [key in SkillRarity]: {
      backgroundColor: string
      boxShadowColor: string
    }
  }
  gradients: {
    lockedSkill: string
    unlockedSkill: string
    ownedSkill: string
  }
}

export type SkilltreeThemeByModes = ThemeMinimumRequired & ThemeMediaWidthsBaseRequired & ThemeByModes<SkilltreeTheme>

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends SkilltreeTheme, ThemeBaseRequired {}
}
