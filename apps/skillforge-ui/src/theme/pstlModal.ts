import { createWeb3ModalTheme as createTheme } from '@past3lle/forge-web3'
import { ikUrlToSimpleImageSrcSet } from '@past3lle/theme'
import { ASSETS_MAP } from 'assets'

const FORGE_LOGO_URL = 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-512-logo.png'
export const FORGE_LOGO_URL_MAP = ikUrlToSimpleImageSrcSet(FORGE_LOGO_URL)

export const pstlModalTheme = createTheme({
  DEFAULT: {
    modals: {
      base: {
        baseFontSize: 16,
        button: {
          main: {
            font: {
              color: 'ghostwhite',
              size: '1em',
              style: 'normal',
              weight: 200,
              letterSpacing: '-1px',
              textShadow: '2px 2px 3px #0000005c',
              textTransform: 'uppercase'
            },
            background: {
              default: '#8576f2cc'
            },
            border: { border: 'none', radius: '1em' },
            hoverAnimations: true
          }
        },
        title: {
          font: {
            color: '#cbb9ee',
            size: '2.5em',
            weight: 700,
            letterSpacing: '-1.4px',
            lineHeight: 0.82,
            textAlign: 'left'
          }
        },
        background: {
          main: 'black',
          url: ASSETS_MAP.images.background.app
        },
        helpers: { show: true },
        closeIcon: {
          size: 40
        }
      },
      connection: {
        button: {
          main: {
            filter: 'invert(1) saturate(2.2) hue-rotate(67deg)',
            background: { default: '#301d4ea1' }
          },
          alternate: {
            background: { default: '#37b9927d' }
          },
          active: {
            filter: 'invert(1) saturate(2.2) hue-rotate(67deg)'
          }
        }
      },
      account: {
        container: {
          main: {
            background: '#1113107a'
          },
          alternate: {
            background: '#1113107a'
          }
        },
        button: {
          main: {
            background: { default: '#584580' },
            filter: 'invert(1) saturate(0.6) hue-rotate(65deg)'
          },
          alternate: {
            filter: 'hue-rotate(-5deg) contrast(1.3)'
            // background: { default: 'indianred', url: 'none' }
          }
        },
        connectionImages: {
          size: '5.5em'
        }
      },
      transactions: {
        baseFontSize: 16,
        text: {
          subHeader: {
            color: 'ghostwhite'
          }
        }
      }
    }
  }
})
