import { SkillRarity, SupportedChains } from '@past3lle/skillforge-web3'
import {
  BackgroundPropertyFull,
  ThemeBaseRequired,
  ThemeByModes,
  ThemeMediaWidthsBaseRequired,
  ThemeMinimumRequired
} from '@past3lle/theme'

type ChainsIcons = {
  readonly disconnected: string
} & {
  readonly [key in SupportedChains]: string
}

type RarityIcons = {
  readonly [key in SkillRarity]: string
}

export interface SkillForgeAssetsMap {
  readonly assetsMap: {
    readonly logos: {
      company: {
        full: BackgroundPropertyFull
        mobile?: BackgroundPropertyFull
      }
    }
    readonly images: {
      background: {
        app?: BackgroundPropertyFull
        header?: {
          background?: BackgroundPropertyFull
          account?: BackgroundPropertyFull
        }
        nav?: {
          background?: BackgroundPropertyFull
        }
      }
      skills?: {
        skillpoint?: {
          highlight?: BackgroundPropertyFull
          empty?: BackgroundPropertyFull
        }
      }
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

export interface SkillForgeTheme extends SkillForgeAssetsMap {
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

export type SkillForgeThemeByModes = ThemeMinimumRequired & ThemeMediaWidthsBaseRequired & ThemeByModes<SkillForgeTheme>

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends SkillForgeTheme, ThemeBaseRequired {}
}
