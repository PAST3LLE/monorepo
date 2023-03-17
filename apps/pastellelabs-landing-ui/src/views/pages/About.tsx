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
import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import SkillForge from 'assets/png/skillforge-screen.png'
import { PastelleLabsHeader } from 'components/Header'
import React from 'react'
import { BoxProps } from 'rebass'

export function About(props: BoxProps) {
  return (
    <StyledElems.SplashWrapper {...props}>
      <PastelleLabsHeader />
      <RowCenter alignItems={'flex-start'} height="70%" flexWrap="wrap">
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
          <Button
            buttonSize={ButtonSizeVariations.BIG}
            buttonVariant={ButtonVariations.PRIMARY}
            fontSize={'3rem'}
            fontWeight={200}
          >
            <a href="https://skills.pastelle.shop" target="_blank">
              Visit Skillforge
            </a>
          </Button>
        </ColumnCenter>
      </RowCenter>
      <ColumnCenter alignItems="center" height="30%">
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
      </ColumnCenter>
    </StyledElems.SplashWrapper>
  )
}
