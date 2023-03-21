import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Description } from './pages/Description'
import { Intro } from './pages/Intro'
import { VerticalSwipeCarousel } from '@past3lle/carousel'
import { ArticleFadeIn as Main, ColumnCenter } from '@past3lle/components'
import { useIsMobile } from '@past3lle/hooks'
import { ThemeProvider } from '@past3lle/theme'
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
  const isMobile = useIsMobile()

  const Content = useCallback(() => {
    if (isMobile) {
      const pagesList = PAGE_CONTENT.concat(() => <Contact />)
      return (
        <VerticalSwipeCarousel
          data={pagesList}
          touchAction="none"
          startIndex={0}
          colors={{ accent: 'white' }}
          indicatorOptions={{
            position: 'top-right'
          }}
          dimensions={{
            minSize: 1200
          }}
          infiniteScrollOptions={{
            visible: 1,
            scaleOptions: {
              initialScale: 1
            }
          }}
        >
          {({ index }) => {
            const Component = pagesList[index]
            return <Component key={index} />
          }}
        </VerticalSwipeCarousel>
      )
    } else {
      return (
        <ColumnCenter>
          {PAGE_CONTENT.map((Content, idx) => (
            <Content key={idx} />
          ))}
        </ColumnCenter>
      )
    }
  }, [isMobile])

  return (
    <ThemeProvider theme={theme}>
      <GlobalCssProviders />
      <Main>
        <Content />
      </Main>
    </ThemeProvider>
  )
}
