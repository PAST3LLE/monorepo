import { createTheme } from '@past3lle/skillforge-widget'
import { ASSETS_MAP } from 'assets'

export const skillforgeTheme = createTheme({
  DEFAULT: {
    assetsMap: ASSETS_MAP,
    canvas: {
      header: {
        collectionNumber: {
          fontFamily: 'Goth',
          fontSize: '4.2rem',
          fontWeight: 900
        },
        collectionText: {
          fontFamily: 'Roboto flex',
          fontWeight: 100
        }
      }
    },
    rarity: {
      common: {
        backgroundColor: '#919191'
      }
    }
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
