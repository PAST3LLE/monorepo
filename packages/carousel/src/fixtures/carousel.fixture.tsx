import { ThemeProvider, createPast3lleTemplateTheme } from '@past3lle/theme'
import React, { ReactNode } from 'react'

import HorizontalSwipeCarousel from '../components/HorizontalSwipeCarousel'
import VerticalSwipeCarousel from '../components/VerticalSwipeCarousel'
import { OptionalCarouselProps } from '../types'

const ITEM_HEIGHT = 500

const DATA = [
  () => (
    <div style={{ width: '100%', height: ITEM_HEIGHT, backgroundColor: 'springgreen' }}>
      <h1>Hellow Page 1</h1>
      <p>SCROLL ME DADDY</p>
    </div>
  ),
  () => (
    <div style={{ width: '100%', height: ITEM_HEIGHT, backgroundColor: 'orange' }}>
      <h1>Hellow Page 2</h1>
      <p>asdasdoiuoiuo12iu3o1i2u3</p>
    </div>
  ),
  () => (
    <div style={{ width: '100%', height: ITEM_HEIGHT, backgroundColor: 'violet' }}>
      <h1>Hellow Page 3</h1>
      <p>1231i27391827391827</p>
    </div>
  ),
  () => (
    <div style={{ width: '100%', height: ITEM_HEIGHT, backgroundColor: 'red' }}>
      <h1>Hellow Page 4</h1>
      <p>1231i27391827391827</p>
    </div>
  ),
  () => (
    <div style={{ width: '100%', height: ITEM_HEIGHT, backgroundColor: 'cyan' }}>
      <h1>Hellow Page 5</h1>
      <p>1231i27391827391827</p>
    </div>
  )
]

function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={createPast3lleTemplateTheme('PASTELLE')}>
      <div style={{ height: '100vh', width: '100%' }}>{children}</div>
    </ThemeProvider>
  )
}

function VerticalCarousel({
  indicatorOptions,
  windowSizeOptions
}: Pick<OptionalCarouselProps, 'indicatorOptions'> & WithWindowSizeOptions) {
  return (
    <Providers>
      <div style={{ height: ITEM_HEIGHT, width: '100%' }}>
        <VerticalSwipeCarousel
          data={DATA}
          windowSizeOptions={windowSizeOptions}
          startIndex={0}
          touchAction="none"
          infiniteScrollOptions={{ visible: 1, scaleOptions: { initialScale: 1 } }}
          indicatorOptions={indicatorOptions}
        >
          {({ index }) => {
            const Comp = DATA[index]
            return <Comp key={index} />
          }}
        </VerticalSwipeCarousel>
      </div>
    </Providers>
  )
}
type WithWindowSizeOptions = { windowSizeOptions?: { throttleMs?: number } }
function HorizontalCarousel({
  indicatorOptions,
  windowSizeOptions
}: Pick<OptionalCarouselProps, 'indicatorOptions'> & WithWindowSizeOptions) {
  return (
    <Providers>
      <div style={{ height: ITEM_HEIGHT, width: '100%' }}>
        <HorizontalSwipeCarousel
          data={DATA}
          axis="x"
          startIndex={0}
          touchAction="none"
          indicatorOptions={indicatorOptions}
          windowSizeOptions={windowSizeOptions}
        >
          {({ index }) => {
            const Comp = DATA[index]
            return <Comp key={index} />
          }}
        </HorizontalSwipeCarousel>
      </div>
    </Providers>
  )
}

export default {
  vertical: <VerticalCarousel indicatorOptions={{ showIndicators: false }} windowSizeOptions={{ throttleMs: 1000 }} />,
  verticalWithIndicators: (
    <VerticalCarousel
      windowSizeOptions={{ throttleMs: 1000 }}
      indicatorOptions={{
        showIndicators: true,
        position: 'bottom',
        barStyles: `
          gap: 0.4rem;
          width: 5px;
          z-index: 99999; 
          opacity: 1;

          > div:not(.active-indicator) {
            background-color: rgba(0 0 0 / 0.1);
          }
        `
      }}
    />
  ),
  horizontal: <HorizontalCarousel windowSizeOptions={{ throttleMs: 1000 }} />,
  horizontalWithIndicators: (
    <HorizontalCarousel
      windowSizeOptions={{ throttleMs: 1000 }}
      indicatorOptions={{
        showIndicators: true,
        position: 'bottom',
        barStyles: `
          gap: 0.4rem; 
          height: 5px; 
          z-index: 99999; 
          opacity: 1;

          > div:not(.active-indicator) {
            background-color: rgba(0 0 0 / 0.1);
          }
        `
      }}
    />
  )
}
