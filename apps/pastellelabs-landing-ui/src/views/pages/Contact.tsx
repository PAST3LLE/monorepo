import * as StyledElems from '../styleds'
import { ColumnCenter, Text } from '@past3lle/components'
import { PastelleLabsHeader } from 'components/Header'
import React from 'react'
import { BoxProps } from 'rebass'
import styled from 'styled-components/macro'

const AboutFooterWrapper = styled(ColumnCenter)`
  align-items: center;
`
export const ContactContent = (props: BoxProps) => (
  <AboutFooterWrapper marginTop="auto" height="20vh" {...props}>
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
)

export function Contact(props: BoxProps) {
  return (
    <StyledElems.SplashWrapper {...props}>
      <PastelleLabsHeader />
      <ContactContent height={'100vh'} />
    </StyledElems.SplashWrapper>
  )
}
