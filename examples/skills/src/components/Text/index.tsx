import { Text } from '@past3lle/components'
import styled from 'styled-components'

export const BlackBoldItalic = styled(Text.Black).attrs((props) => ({
  fontStyle: 'italic',
  fontWeight: 900,
  ...props
}))``

export const BlackHeader = styled(BlackBoldItalic).attrs({ fontSize: '3.5rem', letterSpacing: -2 })`
  padding: 1rem;
  margin: 1rem 0;
`
export const ThemedHeader = styled(BlackHeader)`
  background-color: ${({ theme }) => theme.mainBg};
`
