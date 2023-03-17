import * as StyledElems from '../styleds'
import { RowCenter, SmartImg } from '@past3lle/components'
import { upToSmall, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import PastelleLabsLogo from 'assets/png/main-logo.png'
import SkillForge from 'assets/png/skillforge-screen.png'
import React from 'react'
import { BoxProps } from 'rebass'
import styled from 'styled-components/macro'

const ImageRow = styled(RowCenter)`
  flex-flow: row nowrap;
  height: 60%;

  ${upToSmall`
    flex-flow: row wrap;
    gap: 2rem;
  `}
`
export function Intro(props: BoxProps) {
  return (
    <StyledElems.Wrapper
      bgImage="https://cdn.shopify.com/s/files/1/0567/9389/0867/products/ascendance-stairs-2_bd74580f-639a-4688-8398-fbb300c18d01.png?v=1678717686"
      gap="10%"
      {...props}
    >
      <ImageRow>
        <SmartImg
          path={{ defaultPath: PastelleLabsLogo }}
          pathSrcSet={urlToSimpleGenericImageSrcSet(PastelleLabsLogo)}
          width="60%"
        />
        <SmartImg path={{ defaultPath: SkillForge }} pathSrcSet={urlToSimpleGenericImageSrcSet(SkillForge)} />
      </ImageRow>
      <RowCenter height="20%">
        <StyledElems.HugeHeader textAlign="center" fontWeight={300}>
          BOOST YOUR SALES AND CUSTOMER ENGAGEMENT WITH OUR END-TO-END, WEB3 ENABLED LOYALTY PROGRAMS.
        </StyledElems.HugeHeader>
      </RowCenter>
    </StyledElems.Wrapper>
  )
}
