import { createTheme } from '@past3lle/web3-modal'

export const PALETTE = {
  mainBg: 'rgb(21, 142, 155)',
  mainBgOpaque: '#148f9cad',
  blackOpaque1: 'rgba(0, 0, 0, 0.88)',
  blackOpaque3: '#00000042',
  text: 'red',
  textInverse: 'black'
}

export default createTheme({
  DEFAULT: {
    modals: {
      connection: {
        baseFontSize: 20,
        background: {
          main: 'pink',
          url: 'https://uploads-ssl.webflow.com/63fdf8c863bcf0c02efdffbc/64144c23e693f7d7f5cdb958_chorus_logo.svg',
        }, 
        text: {
          header: {
            color: PALETTE.text,
            size: '2.5rem'
          },
        },
        button: {
          main: {
            background: { default: PALETTE.mainBgOpaque },
            font: {
              weight: 600,
              size: '1rem',
              letterSpacing: '-1.1px',
              style: 'normal',
              textShadow: '3px 2px 2px #00000078',
            },
            border: {
              border: 'none'
            }
          }
        }
      },
      account: {
        container: {
          main: {
            background: '#0a383ee0' || '#1e1e1edb'
          }
        }
      }
    }
  }
})
