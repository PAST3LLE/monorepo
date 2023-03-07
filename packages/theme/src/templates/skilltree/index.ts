import { ThemeContentPartsRequired } from '../../types'
import { BaseColours } from '../base'

export type SkilltreeThemeExtension = Partial<ThemeContentPartsRequired> & {
  text1: string
  bg1: string
  mainBg: string
  mainBgDarker: string
  mainBg2: string
  mainFg: string
  mainFg2: string
  darkText: string
  lightText: string
  // logo
  logo: {
    mainBgLight: string
    mainBg: string
    altBgLight: string
    altBg: string
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
  button: {
    fontSize: {
      small: string
      normal: string
      large: string
    }
    border: {
      radius: string
      border: string
      colour: string
    }
    hoverColour: string
  }
  input: {
    border: {
      radius: string
      border: string
      colour: string
    }
    hoverColour: string
  }
  content: {
    background: string
    backgroundAlt: string
    text: string
    textAlt: string
  }
  darkModeToggle: string
  darkModeSvg: string
  darkModeFilter: string
  darkModeLogoFilter: string
}

const SkilltreeTheme = {
  modes: {
    DEFAULT: {
      mainText: '#fff',
      darkText: '#000',
      lightText: 'ghostwhite',
      mainBg: '#d5fb73',
      mainBgDarker: '#94c614',
      mainBgAlt: '#262528',
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
      input: {
        border: {
          radius: '1rem',
          border: 'none',
          colour: 'transparent'
        },
        hoverColour: '#d5fb73'
      },
      content: {
        background: BaseColours.offwhiteOpaque,
        backgroundAlt: BaseColours.blackOpaque,
        text: BaseColours.black,
        textAlt: BaseColours.offwhiteOpaqueMost
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
      },
      // Asset map - needs filling externally
      assetsMap: {}
    },
    DARK: {},
    LIGHT: {}
  }
} as const

export const Theme = { ...BaseColours, ...SkilltreeTheme }
