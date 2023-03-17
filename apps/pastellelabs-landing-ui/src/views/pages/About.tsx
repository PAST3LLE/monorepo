import * as StyledElems from '../styleds'
import {
  Button,
  ButtonSizeVariations,
  ButtonVariations,
  ColumnCenter,
  RowCenter,
  SmartImg,
  Text
} from '@past3lle/components'
import { upToSmall, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import SkillForge from 'assets/png/skillforge-screen.png'
import { PastelleLabsHeader } from 'components/Header'
import React from 'react'
import { BoxProps } from 'rebass'
import styled from 'styled-components/macro'

const AboutContentWrapper = styled(RowCenter)`
  align-items: flex-start;
  flex-wrap: wrap;
  height: 70vh;

  ${upToSmall`
    > ${ColumnCenter} {
      flex: unset;
      height: 50%;
    }
    > ${Text.SubHeader} {
      font-size: 4.5vw;
    }
  `}
`

const AboutFooterWrapper = styled(ColumnCenter)`
  align-items: center;
  height: 20vh;
`
export function About(props: BoxProps) {
  return (
    <StyledElems.SplashWrapper {...props}>
      <PastelleLabsHeader />
      <AboutContentWrapper>
        <Text.SubHeader fontWeight={300} padding="2rem" flex="1 1 200px">
          We are a team of experienced Web3 developers and entrepreneurs utilising this loyalty system for our own
          streetwear label, PASTELLE APPAREL.
          <br />
          <br />
          Check out how PASTELLE APPAREL has integrated its Web3-enabled rewards program by visiting PASTELLE's
          SkillForge interface or read about other examples in our blog!
        </Text.SubHeader>
        <ColumnCenter flex="1 1 500px">
          <SmartImg path={{ defaultPath: SkillForge }} pathSrcSet={urlToSimpleGenericImageSrcSet(SkillForge)} />
          <a href="https://skills.pastelle.shop" target="_blank">
            <Button buttonSize={ButtonSizeVariations.BIG} buttonVariant={ButtonVariations.SECONDARY}>
              Visit Skillforge
            </Button>
          </a>
        </ColumnCenter>
      </AboutContentWrapper>
      <AboutFooterWrapper marginTop="auto">
        <Text.SubHeader>
          PASTELLE LABS
          <br />
          <a style={{ fontWeight: 200 }} href="emailto:hello@pastellelabs.com">
            hello@pastellelabs.com
          </a>
          <br />
          <br />
          <small>Copyright {new Date().getFullYear()}</small>
        </Text.SubHeader>
      </AboutFooterWrapper>
    </StyledElems.SplashWrapper>
  )
}
