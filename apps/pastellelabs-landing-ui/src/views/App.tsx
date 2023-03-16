import { VerticalSwipeCarousel } from '@past3lle/carousel'
import { ArticleFadeIn as Main, ColumnCenter, Header, Text } from '@past3lle/components'
import { setBackgroundWithDPI, ThemeProvider, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import React from 'react'
import styled from 'styled-components/macro'
import { GlobalCssProviders } from 'theme/global'
import { theme } from 'theme/theme'

const HugeHeader = styled(Text.LargeHeader)`
  font-size: 5rem;
  font-weight: 200;
`

const Wrapper = styled(ColumnCenter)<{ bgImage: string }>`
  padding: 2rem;
  background: ${({ theme, bgImage }) => setBackgroundWithDPI(theme, urlToSimpleGenericImageSrcSet(bgImage))};
  height: 100vh;
`

export const PAGE_CONTENT = [
  <Wrapper bgImage="https://cdn.shopify.com/s/files/1/0567/9389/0867/products/ascendance-stairs-2_bd74580f-639a-4688-8398-fbb300c18d01.png?v=1678717686">
    <HugeHeader>WELCOME TO PASTELLE LABS</HugeHeader>
    <Text.SubHeader>
      CONTENT TO BE WRITTEN ABOUT THE STUFF THAT'S IMPORTANT TO TALK ABOUT IN THE PAGE ABOUT THE STUFF IN THE CUTY OF
      THE BAG DROP OFF WHICH INCLUES AMYN DARTICLES OF CLOTHING THAT HAVE BEEN DISCARTED TDO THE FACT TAHT TPASTELLE
      LABS IS THE BEST ENGAGEMENT CONMPANY IN THE WORLD FOR WEB3 INTERESTED CLIENTS AND AIMS TO PROVIDE THE BEST
      GAMIFIED APPROACHES TO GENERATING REVENUE AND RETURNALS TO THE SITE ASLKIN TO THE KILLSTREEBOARDS BFOUNDS IN
      DIABLO 2 AND SIMILAR LIKE TOP DOWN ISOMETRIC 3D GAMES OF OUR PAST.
    </Text.SubHeader>
  </Wrapper>,
  <Wrapper bgImage="https://cdn.shopify.com/s/files/1/0567/9389/0867/products/Screenshot_20230313-143848_580f5876-3d19-4bd9-a55e-b6b7a36374e8.jpg?v=1678718820">
    <HugeHeader>PAGE 2</HugeHeader>
    <Text.SubHeader>
      CONTENT TO BE WRITTEN ABOUT THE STUFF THAT'S IMPORTANT TO TALK ABOUT IN THE PAGE ABOUT THE STUFF IN THE CUTY OF
      THE BAG DROP OFF WHICH INCLUES AMYN DARTICLES OF CLOTHING THAT HAVE BEEN DISCARTED TDO THE FACT TAHT TPASTELLE
      LABS IS THE BEST ENGAGEMENT CONMPANY IN THE WORLD FOR WEB3 INTERESTED CLIENTS AND AIMS TO PROVIDE THE BEST
      GAMIFIED APPROACHES TO GENERATING REVENUE AND RETURNALS TO THE SITE ASLKIN TO THE KILLSTREEBOARDS BFOUNDS IN
      DIABLO 2 AND SIMILAR LIKE TOP DOWN ISOMETRIC 3D GAMES OF OUR PAST.
    </Text.SubHeader>
  </Wrapper>,
  <Wrapper bgImage="https://cdn.shopify.com/s/files/1/0567/9389/0867/products/Screenshot_20230313-143703_88675cc9-5625-4bd2-b302-899ebfa3aaab.jpg?v=1678718654">
    <HugeHeader>PAGE 3</HugeHeader>
    <Text.SubHeader>
      CONTENT TO BE WRITTEN ABOUT THE STUFF THAT'S IMPORTANT TO TALK ABOUT IN THE PAGE ABOUT THE STUFF IN THE CUTY OF
      THE BAG DROP OFF WHICH INCLUES AMYN DARTICLES OF CLOTHING THAT HAVE BEEN DISCARTED TDO THE FACT TAHT TPASTELLE
      LABS IS THE BEST ENGAGEMENT CONMPANY IN THE WORLD FOR WEB3 INTERESTED CLIENTS AND AIMS TO PROVIDE THE BEST
      GAMIFIED APPROACHES TO GENERATING REVENUE AND RETURNALS TO THE SITE ASLKIN TO THE KILLSTREEBOARDS BFOUNDS IN
      DIABLO 2 AND SIMILAR LIKE TOP DOWN ISOMETRIC 3D GAMES OF OUR PAST.
    </Text.SubHeader>
  </Wrapper>
]

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalCssProviders />
      <Header>
        <Text.LargeHeader>PASTELLE LABS</Text.LargeHeader>
      </Header>
      <Main>
        <VerticalSwipeCarousel
          data={PAGE_CONTENT}
          touchAction="none"
          startIndex={0}
          accentColor="white"
          fixedSizes={undefined}
          indicatorProps={{
            position: 'bottom-left'
          }}
          sizeOptions={{
            minSize: 1200
          }}
          infiniteScrollOptions={{
            visible: 1,
            snapOnScroll: true,
            scaleOptions: {
              initialScale: 1
            }
          }}
        >
          {({ index }) => PAGE_CONTENT[index]}
        </VerticalSwipeCarousel>
      </Main>
    </ThemeProvider>
  )
}
