import { PNG } from '@past3lle/assets'
import { fromExtraSmall } from '@past3lle/theme'
import styled from 'styled-components'

export const Pastellecon = styled.div`
  height: 100%;
  width: 100%;
  transition: transform 0.3s ease;

  background: url(${PNG.PNG_LogoFull_2x}) left/contain no-repeat;
  ${fromExtraSmall`background: url(${PNG.PNG_LogoShort_2x}) left/contain no-repeat;`}

  &:hover {
    transform: rotate(-5deg);
  }
`

export const Logo = Pastellecon
export const PastelleLogo = Pastellecon
