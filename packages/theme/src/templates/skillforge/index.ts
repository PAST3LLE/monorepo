import { BackgroundPropertyFull, ThemeByModes } from '../../types'
import { BaseColours } from '../base'

export interface SkillForgeThemeExtension {
  mainText: string
  darkText: string
  lightText: string
  mainBg: string
  mainBgDarker: string
  mainBgAlt: string
  mainFg: string
  mainFgAlt: string

  button: {
    // defaults
    border: { radius: string; colour: string; border: string }
    fontSize: { small: string; normal: string; large: string }
    // custom
    mainBg: string
    mainBgLight: string
    altBg: string
    altBgLight: string
    hoverColour: string
  }
  // rarity colours
  rarity: {
    empty: {
      backgroundColor: string
      boxShadowColor: string
    }
    common: {
      backgroundColor: string
      boxShadowColor: string
    }
    rare: {
      backgroundColor: string
      boxShadowColor: string
    }
    legendary: {
      backgroundColor: string
      boxShadowColor: string
    }
    epic: {
      backgroundColor: string
      boxShadowColor: string
    }
  }
  gradients: {
    lockedSkill: string
    unlockedSkill: string
    ownedSkill: string
  }
  assetsMap: {
    logos: {
      company: {
        full: BackgroundPropertyFull
        mobile?: BackgroundPropertyFull
      }
    }
    images: {
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
        }
      }
    }
    icons: {
      locked: string
      connection: string
      inventory: string
      shop: string
      chains: Record<string, string>
      rarity: Record<string, string>
    }
  }
}

const SkillForgeTheme: ThemeByModes<
  Omit<SkillForgeThemeExtension, 'assetsMap'> & { assetsMap?: SkillForgeThemeExtension['assetsMap'] }
> = {
  modes: {
    DEFAULT: {
      mainText: '#000',
      darkText: '#000',
      lightText: 'ghostwhite',
      mainBg: '#d5fb73',
      mainBgDarker: '#94c614',
      mainBgAlt: '#deefe1',
      mainFg: 'ghostwhite',
      mainFgAlt: '#d5fb73',

      button: {
        mainBg: '#475548',
        mainBgLight: '#deefe1',
        altBg: '#281d25',
        altBgLight: '#b6abb6',
        fontSize: {
          small: '1rem',
          normal: '1.2rem',
          large: '1.6rem'
        },
        border: {
          radius: '1rem',
          border: '0.1rem solid transparent',
          colour: 'none'
        },
        hoverColour: 'cornflowerblue'
      },
      // rarity colours
      rarity: {
        empty: {
          backgroundColor: 'transparent',
          boxShadowColor: '0px 0px transparent'
        },
        common: {
          backgroundColor: '#969696b3',
          boxShadowColor: '12px 2px #969696b3'
        },
        rare: { backgroundColor: '#6495ed', boxShadowColor: '12px 2px #6495ed' },
        legendary: {
          backgroundColor: '#ab64ffbd',
          boxShadowColor: '12px 8px #8000809e'
        },
        epic: { backgroundColor: '#ffb467', boxShadowColor: '12px 8px #ffb467' }
      },
      gradients: {
        lockedSkill: 'linear-gradient(195deg, lightgrey, darkred)',
        unlockedSkill: 'linear-gradient(195deg, lightgrey,',
        ownedSkill: 'linear-gradient(195deg, lightgrey, #208120)'
      }
    },
    DARK: {} as SkillForgeThemeExtension,
    LIGHT: {} as SkillForgeThemeExtension
  }
} as const

export const Theme = { ...BaseColours, ...SkillForgeTheme }
