import { setAnimation } from '@past3lle/theme'
import styled from 'styled-components'

import { flashingTextAnimation } from '../../../theme/animations'

export const FlashingText = styled.strong<{ duration?: number }>`
  ${({ duration = 1.5 }) =>
    setAnimation(flashingTextAnimation, { name: 'flashingText' as any, duration, count: 'infinite' })}
`
