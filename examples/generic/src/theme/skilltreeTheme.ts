import { createCustomTheme } from '@past3lle/theme'

enum Rarity {
  EMPTY = 'empty',
  COMMON = 'common',
  RARE = 'rare',
  LEGENDARY = 'legendary',
  EPIC = 'epic'
}

const SKILLTREE_WIDGET_THEME = {
  modes: {
    DEFAULT: {
      assetsMap: {
        logos: {
          companyMain: '123'
        },
        images: {
          appBackground: 'string',
          skillpointHighlight: 'string'
        },
        icons: {
          locked: 'string',
          connection: 'string',
          inventory: 'string',
          shop: 'string',
          chains: {
            disconnected: 'disconnected-logo',
            5: 'GOERLI-logo',
            80001: 'POLYGON_MUMBAI-logo'
          },
          rarity: {
            empty: 'empty',
            common: 'common',
            rare: 'rare',
            legendary: 'lej',
            epic: 'epic'
          }
        }
      },
      mainText: 'red',
      darkText: 'red',
      lightText: 'red',
      mainBg: 'red',
      mainBgDarker: 'red',
      mainBgAlt: 'red',
      mainFg: 'red',
      mainFgAlt: 'red',

      button: {
        mainBg: 'red',
        mainBgLight: 'red',
        altBg: 'red',
        altBgLight: 'red',
        border: {
          border: '1rem',
          radius: '1rem',
          colour: 'red'
        },
        fontSize: {
          small: '1rem',
          normal: '2rem',
          large: '3rem'
        },
        hoverColour: 'red'
      },
      fontSize: {
        small: '1rem',
        normal: '2rem',
        large: '3rem'
      },
      // rarity colours
      rarity: {
        [Rarity.EMPTY]: {
          backgroundColor: 'red',
          boxShadowColor: 'red'
        },
        [Rarity.COMMON]: {
          backgroundColor: 'red',
          boxShadowColor: 'red'
        },
        [Rarity.RARE]: {
          backgroundColor: 'red',
          boxShadowColor: 'red'
        },
        [Rarity.LEGENDARY]: {
          backgroundColor: 'red',
          boxShadowColor: 'red'
        },
        [Rarity.EPIC]: {
          backgroundColor: 'red',
          boxShadowColor: 'red'
        }
      },
      gradients: {
        lockedSkill: 'red',
        unlockedSkill: 'red',
        ownedSkill: 'red'
      }
    },
    LIGHT: {},
    DARK: {}
  }
} as const

export const skilltreeThemeCustom = createCustomTheme(SKILLTREE_WIDGET_THEME)
