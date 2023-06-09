import { ikUrlToSimpleImageSrcSet } from '@past3lle/theme'
import { createTheme } from '@past3lle/web3-modal'
import { ASSETS_MAP } from 'assets'

const FORGE_LOGO_URL = 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-512-logo.png'
export const FORGE_LOGO_URL_MAP = ikUrlToSimpleImageSrcSet(FORGE_LOGO_URL)

export const pstlModalTheme = createTheme({
  DEFAULT: {
    modals: {
      connection: {
        backgroundImg: ASSETS_MAP.images.background.app,
        baseFontSize: 20,
        helpers: { show: true },
        closeIcon: {
          size: '40px'
        },
        title: { color: '#cbb9ee', fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 0.82 },
        button: {
          backgroundColor: '#301d4ea1',
          connectedBackgroundColor: '#37b9927d',
          border: { border: 'none', radius: '1em' },
          color: 'ghostwhite',
          fontSize: '1em',
          fontStyle: 'normal',
          fontWeight: 200,
          letterSpacing: '-1px',
          textShadow: '2px 2px 3px #0000005c',
          textTransform: 'uppercase',
          hoverAnimations: true
        }
      }
    }
  }
})
