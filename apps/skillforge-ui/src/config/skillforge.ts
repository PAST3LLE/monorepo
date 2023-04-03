import { createPast3lleTemplateTheme } from '@past3lle/theme'
import { ASSETS_MAP } from 'assets'

export const skillforgeTheme = createPast3lleTemplateTheme('SKILLFORGE', {
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
