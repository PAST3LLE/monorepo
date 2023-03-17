import { Header, SmartImg } from '@past3lle/components'
import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import PastelleLabsLogo from 'assets/png/main-logo.png'
import React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components/macro'

const HeaderWrapper = styled(Header)`
  > picture {
    max-width: 15%;
  }
`

export function PastelleLabsHeader({ children }: { children?: ReactNode }) {
  return (
    <HeaderWrapper>
      <SmartImg path={{ defaultPath: PastelleLabsLogo }} pathSrcSet={urlToSimpleGenericImageSrcSet(PastelleLabsLogo)} />
      {children}
    </HeaderWrapper>
  )
}
