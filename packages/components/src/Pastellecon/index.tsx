import styled from 'styled-components'

import { fromExtraSmall } from '@past3lle/theme'
import { LogoShort, LogoFull } from '@past3lle/assets'

export const Pastellecon = styled.div`
  height: 100%;
  width: 100%;
  transition: transform 0.3s ease;

  background: url(${LogoShort}) left/contain no-repeat;
  ${fromExtraSmall`background: url(${LogoFull}) left/contain no-repeat;`}

  &:hover {
    transform: rotate(-5deg);
  }
`

export const Logo = Pastellecon
export const PastelleLogo = Pastellecon
