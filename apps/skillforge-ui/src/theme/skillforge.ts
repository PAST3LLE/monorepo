import { createTheme } from '@past3lle/skillforge-widget'
import { ASSETS_MAP } from 'assets'

export const skillforgeTheme = createTheme({
  DEFAULT: {
    assetsMap: ASSETS_MAP
  },
  ALT: {
    mainBgAlt: 'darkred',
    mainBg: '#794b79',
    mainFg: 'cyan',
    rarity: {
      common: {
        backgroundColor: 'yellow'
      }
    },
    assetsMap: ASSETS_MAP
  }
})
