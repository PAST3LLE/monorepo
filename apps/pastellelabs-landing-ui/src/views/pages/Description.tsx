import * as StyledElems from '../styleds'
import { Button, ButtonVariations, RowCenter, SmartImg, Text } from '@past3lle/components'
import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import CHECKLIST from 'assets/png/checklist.png'
import GIFT from 'assets/png/gift.png'
import LOCK from 'assets/png/lock.png'
import { PastelleLabsHeader } from 'components/Header'
import React from 'react'
import { BoxProps } from 'rebass'
import styled from 'styled-components/macro'

const DescriptionText = styled(Text.Italic)`
  text-align: center;
`
export function Description(props: BoxProps) {
  return (
    <StyledElems.Wrapper backgroundColor={'#000'} {...props}>
      <PastelleLabsHeader />
      <StyledElems.GridColumnWrapper height="60%" gap="1rem">
        <StyledElems.IconContainer>
          <SmartImg path={{ defaultPath: GIFT }} pathSrcSet={urlToSimpleGenericImageSrcSet(GIFT)} />
          <StyledElems.HugeHeader>CUSTOM REWARDS</StyledElems.HugeHeader>
          <DescriptionText>REWARD CUSTOMERS WITH DIGITAL COLLECTABLES ASSOCIATED TO THEIR PURCHASES.</DescriptionText>
        </StyledElems.IconContainer>

        <StyledElems.IconContainer>
          <SmartImg path={{ defaultPath: LOCK }} pathSrcSet={urlToSimpleGenericImageSrcSet(LOCK)} />
          <StyledElems.HugeHeader>GAMIFIED ENGAGEMENT</StyledElems.HugeHeader>
          <DescriptionText>PROVIDE ACCESS TO LIMITED PERKS TO OWNERS OF YOUR DIGITAL COLLECTABLES.</DescriptionText>
        </StyledElems.IconContainer>

        <StyledElems.IconContainer>
          <SmartImg path={{ defaultPath: CHECKLIST }} pathSrcSet={urlToSimpleGenericImageSrcSet(CHECKLIST)} />
          <StyledElems.HugeHeader>END-TO-END SOLUTION</StyledElems.HugeHeader>
          <DescriptionText>
            WE CONSULT ON, INTEGRATE, AND HOST YOUR WEB3-ENABLED LOYALTY PROGRAM. INCLUDING ANALYTICS TO MEASURE
            SUCCESS.
          </DescriptionText>
        </StyledElems.IconContainer>
      </StyledElems.GridColumnWrapper>
      <RowCenter gap="2rem">
        <Button buttonVariant={ButtonVariations.SECONDARY} fontSize="3rem">
          Book a call
        </Button>
        <Button buttonVariant={ButtonVariations.SECONDARY} fontSize="3rem">
          Learn more
        </Button>
      </RowCenter>
    </StyledElems.Wrapper>
  )
}
