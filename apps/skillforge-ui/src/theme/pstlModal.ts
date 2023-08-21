import { ikUrlToSimpleImageSrcSet } from '@past3lle/theme'
import { createTheme } from '@past3lle/web3-modal'
import { ASSETS_MAP } from 'assets'

const FORGE_LOGO_URL = 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-512-logo.png'
export const FORGE_LOGO_URL_MAP = ikUrlToSimpleImageSrcSet(FORGE_LOGO_URL)

export const pstlModalTheme = createTheme({
  DEFAULT: {
    modals: {
      base: {
        baseFontSize: 16,
        title: {
          font: {
            color: '#cbb9ee',
            weight: 700,
            letterSpacing: '-1.4px',
            lineHeight: 0.82,
            textAlign: 'left'
          }
        },
        background: {
          backgroundImg: ASSETS_MAP.images.background.app
        },
        helpers: { show: true },
        closeIcon: {
          size: 40
        }
      },
      connection: {
        button: {
          background: {
            background: '#301d4ea1',
            connected: '#37b9927d'
          },
          font: {
            color: 'ghostwhite',
            size: '1em',
            style: 'normal',
            weight: 200,
            letterSpacing: '-1px',
            textShadow: '2px 2px 3px #0000005c',
            textTransform: 'uppercase'
          },
          border: { border: 'none', radius: '1em' },
          hoverAnimations: true
        }
      }
    }
  }
})
