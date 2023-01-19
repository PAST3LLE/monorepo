import { BoxProps } from 'rebass'
import styled from 'styled-components'

import { setFadeInAnimation } from '../../theme/styles/animation'

export const Article = styled.article<{ display?: BoxProps['display'] }>`
  ${({ display }) => display && `display: ${display};`}
  position: relative;
  overflow: hidden;
`

export const ArticleFadeIn = styled(Article)`
  filter: contrast(1) blur(0px);
  ${setFadeInAnimation()}
`
