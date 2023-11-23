import { VerticalSwipeCarousel } from '@past3lle/carousel'
import { ThemeProvider, createPast3lleTemplateTheme } from '@past3lle/theme'
import { PstlW3Providers } from '@past3lle/web3-modal'
import type { AppProps } from 'next/app'

import AppWithWeb3Access from '../components/AppWithWeb3Access'
import { pstlModalConfig } from '../web3/connection'

const DATA = [
  () => (
    <div style={{ height: '100%', backgroundColor: 'springgreen' }}>
      <h1>Hellow Page 1</h1>
      <p>SCROLL ME DADDY</p>
    </div>
  ),
  () => (
    <div style={{ height: '100%', backgroundColor: 'orange' }}>
      <h1>Hellow Page 2</h1>
      <p>asdasdoiuoiuo12iu3o1i2u3</p>
    </div>
  ),
  () => (
    <div style={{ height: '100%', backgroundColor: 'violet' }}>
      <h1>Hellow Page 3</h1>
      <p>1231i27391827391827</p>
    </div>
  )
]
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PstlW3Providers config={pstlModalConfig}>
      {/* @ts-ignore */}
      <Component {...pageProps} />
      <AppWithWeb3Access />
      <ThemeProvider theme={createPast3lleTemplateTheme('PASTELLE')}>
        <div style={{ height: 500 }}>
          <VerticalSwipeCarousel
            data={DATA}
            startIndex={0}
            touchAction={'auto'}
            infiniteScrollOptions={{ visible: 2, scaleOptions: { initialScale: 1 } }}
          >
            {({ index }) => {
              const Comp = DATA[index]
              return (
                <div style={{ height: 500, width: '100%' }}>
                  <Comp key={index} />
                </div>
              )
            }}
          </VerticalSwipeCarousel>
        </div>
      </ThemeProvider>
    </PstlW3Providers>
  )
}

export default MyApp
