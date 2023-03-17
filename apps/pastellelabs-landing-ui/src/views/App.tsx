import { About } from './pages/About'
import { Description } from './pages/Description'
import { Intro } from './pages/Intro'
import { VerticalSwipeCarousel } from '@past3lle/carousel'
import { ArticleFadeIn as Main, ColumnCenter } from '@past3lle/components'
import { useWindowSize } from '@past3lle/hooks'
import { MEDIA_WIDTHS, ThemeProvider } from '@past3lle/theme'
import React, { useCallback } from 'react'
import { BoxProps } from 'rebass'
import { GlobalCssProviders } from 'theme/global'
import { theme } from 'theme/theme'

export const PAGE_CONTENT = [
  (props: BoxProps) => <Intro {...props} />,
  (props: BoxProps) => <Description {...props} />,
  (props: BoxProps) => <About {...props} />
]

export function App() {
  const sizes = useWindowSize()
  const isMobileWidth = sizes?.width && sizes.width <= MEDIA_WIDTHS.upToSmall

  const Content = useCallback(() => {
    if (isMobileWidth) {
      return (
        <VerticalSwipeCarousel
          data={PAGE_CONTENT}
          touchAction="none"
          startIndex={0}
          colors={{ accent: 'white' }}
          indicatorOptions={{
            position: 'top-right'
          }}
          dimensions={{
            placeholderSize: 1200
          }}
          infiniteScrollOptions={{
            visible: 1,
            scaleOptions: {
              initialScale: 1
            }
          }}
        >
          {({ index }) => {
            const Component = PAGE_CONTENT[index]
            return <Component key={index} />
          }}
        </VerticalSwipeCarousel>
      )
    } else {
      return (
        <ColumnCenter>
          {PAGE_CONTENT.map((Content) => (
            <Content />
          ))}
        </ColumnCenter>
      )
    }
  }, [isMobileWidth])

  return (
    <ThemeProvider theme={theme}>
      <GlobalCssProviders />
      <Main>
        <Content />
      </Main>
    </ThemeProvider>
  )
}
