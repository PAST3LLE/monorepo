import { WindowSizeProvider } from '@past3lle/hooks'
import { ThemeProvider, createPast3lleTemplateTheme } from '@past3lle/theme'
import React, { ReactNode, useState } from 'react'

import HorizontalSwipeCarousel from '../components/HorizontalSwipeCarousel'
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

function Providers({ children }: { children: ReactNode }) {
  return (
    <WindowSizeProvider>
      <ThemeProvider theme={createPast3lleTemplateTheme('PASTELLE')}>
        <div style={{ height: '100vh', width: '100%' }}>{children}</div>
      </ThemeProvider>
    </WindowSizeProvider>
  )
}

function VerticalCarousel() {
  return (
    <Providers>
      <div style={{ height: 500, width: '100%' }}>
        <VerticalSwipeCarousel
          data={DATA}
          startIndex={0}
          touchAction="none"
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
      </div>
    </Providers>
  )
}

function HorizontalCarousel() {
  return (
    <Providers>
      <div style={{ height: 500, width: '100%' }}>
        <HorizontalSwipeCarousel data={DATA} axis="x" startIndex={0} touchAction="none">
          {({ index }) => {
            const Comp = DATA[index]
            return (
              <div style={{ height: '100vh', width: '100%' }}>
                <Comp key={index} />
              </div>
            )
          }}
        </HorizontalSwipeCarousel>
      </div>
    </Providers>
  )
}

export default {
  vertical: <VerticalCarousel />,
  horizontal: <HorizontalCarousel />
}
