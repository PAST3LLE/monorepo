import { createTheme } from "@past3lle/web3-modal"

export const PALETTE = {
    mainBg: 'rgb(21, 142, 155)',
    mainBgOpaque: '#148f9cad',
    blackOpaque1: 'rgba(0, 0, 0, 0.88)',
    blackOpaque3: '#00000042',
    text: 'ghostwhite',
    textInverse: 'black'
  }
  
  export default createTheme({
    DEFAULT: {
      modals: {
        connection: {
          baseFontSize: 20,
          backgroundImg:
            'https://uploads-ssl.webflow.com/63fdf8c863bcf0c02efdffbc/64144c23e693f7d7f5cdb958_chorus_logo.svg',
          title: {
            color: PALETTE.text,
            fontSize: '2.5rem'
          },
          button: {
            backgroundColor: PALETTE.mainBgOpaque,
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: '-1.1px',
            fontStyle: 'normal',
            textShadow: '3px 2px 2px #00000078',
            border: {
              border: 'none'
            }
          }
        },
        account: {
          balanceAndAddressContainer: {
            backgroundColor: '#0a383ee0' || '#1e1e1edb'
          }
        }
      }
    }
  })