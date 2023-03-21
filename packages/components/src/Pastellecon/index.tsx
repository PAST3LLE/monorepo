import { PNG_LogoFull_2x, PNG_LogoShort_2x } from '@past3lle/assets'
import { fromExtraSmall } from '@past3lle/theme'
import styled from 'styled-components'

export const Pastellecon = styled.div<{ $smallLogo?: string; $fullLogo?: string }>`
  height: 100%;
  width: 100%;
  transition: transform 0.3s ease;

  background: ${({ $smallLogo = PNG_LogoShort_2x }) => `url(${$smallLogo}) left/contain no-repeat`};
  ${({ $fullLogo = PNG_LogoFull_2x }) => fromExtraSmall`background: url(${$fullLogo}) left/contain no-repeat;`}

  &:hover {
    transform: rotate(-5deg);
  }
`

export const Logo = Pastellecon
export const PastelleLogo = Pastellecon
