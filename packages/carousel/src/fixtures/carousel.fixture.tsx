import { WindowSizeProvider } from '@past3lle/hooks'
import { ThemeProvider, createPast3lleTemplateTheme } from '@past3lle/theme'
import React from 'react'

import VerticalSwipeCarousel from '../components/VerticalSwipeCarousel'

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

export default {
  default: (
    <WindowSizeProvider>
      <ThemeProvider theme={createPast3lleTemplateTheme('PASTELLE')}>
        <VerticalSwipeCarousel
          data={DATA}
          startIndex={0}
          touchAction={'auto'}
          infiniteScrollOptions={{ visible: 1, scaleOptions: { initialScale: 1 } }}
        >
          {({ index }) => {
            const Comp = DATA[index]
            return (
              <div style={{ height: '100vh', width: '100%' }}>
                <Comp key={index} />
              </div>
            )
          }}
        </VerticalSwipeCarousel>
      </ThemeProvider>
    </WindowSizeProvider>
  )
}
