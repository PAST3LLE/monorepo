import { ChainsPartialReadonly, SkillRarity, SupportedForgeChains } from '@past3lle/forge-web3'
import {
  BackgroundPropertyFull,
  ThemeBaseRequired,
  ThemeByModes,
  ThemeMediaWidthsBaseRequired,
  ThemeMinimumRequired
} from '@past3lle/theme'

type ChainsIcons<SC extends ChainsPartialReadonly<SupportedForgeChains> = ChainsPartialReadonly<SupportedForgeChains>> =
  {
    readonly [key in SC[number]['id']]: string
  } & {
    readonly disconnected: string
  }

type RarityIcons = {
  readonly [key in SkillRarity]: string
}

export interface SkillForgeAssetsMap<
  SC extends ChainsPartialReadonly<SupportedForgeChains> = ChainsPartialReadonly<SupportedForgeChains>
> {
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
      chains: ChainsIcons<SC>
      rarity: RarityIcons
    }
  }
}
export enum ForgeSidePanelTypes {
  ERROR = 'ERROR',
  ACTIVE_SKILL = 'ACTIVE_SKILL',
  UPGRADE_SKILL = 'UPGRADE_SKILL',
  INVENTORY = 'INVENTORY'
}

export interface SkillForgeTheme<SC extends ChainsPartialReadonly<SupportedForgeChains>>
  extends SkillForgeAssetsMap<SC> {
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

  canvas?: {
    header?: {
      collectionNumber?: {
        color?: string
        fontFamily?: string
        fontSize?: string
        fontWeight?: number
      }
      collectionText?: {
        color?: string
        fontFamily?: string
        fontSize?: string
        fontWeight?: number
      }
    }
  }

  sidePanels?: {
    [type in ForgeSidePanelTypes]?: {
      container?: {
        backgroundColor?: string
        color?: string
      }
    }
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

export type SkillForgeThemeByModes<
  SC extends ChainsPartialReadonly<SupportedForgeChains> = ChainsPartialReadonly<SupportedForgeChains>
> = ThemeMinimumRequired & ThemeMediaWidthsBaseRequired & ThemeByModes<SkillForgeTheme<SC>>

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme
    extends SkillForgeTheme<ChainsPartialReadonly<SupportedForgeChains>>,
      ThemeBaseRequired {}
}
