import styled from 'styled-components'
import { fromExtraSmall } from '../theme'

import PASTELLE_LOGO_SHORT from '../assets/svg/pastelle-logo-short.svg'
import PASTELLE_LOGO_FULL from '../assets/svg/pastelle-logo-full.svg'

export const Pastellecon = styled.div`
  height: 100%;
  width: 100%;
  transition: transform 0.3s ease;

  background: url(${PASTELLE_LOGO_SHORT}) left/contain no-repeat;
  ${fromExtraSmall`background: url(${PASTELLE_LOGO_FULL}) left/contain no-repeat;`}

  &:hover {
    transform: rotate(-5deg);
  }
`

export const Logo = Pastellecon
export const PastelleLogo = Pastellecon
