import { Text } from '@past3lle/components'
import styled from 'styled-components/macro'

export const BlackBoldItalic = styled(Text.Black).attrs((props) => ({
  fontStyle: 'italic',
  fontWeight: 900,
  ...props,
}))``

export const BlackHeader = styled(BlackBoldItalic).attrs((props) => ({
  fontSize: '3.5rem',
  letterSpacing: -2,
  ...props,
}))`
  padding: 1rem;
  margin: 1rem 0;
`
export const ThemedHeader = styled(BlackHeader)`
  background-color: ${({ theme }) => theme.mainBg};
`

export const MonospaceText = styled(Text.Black)`
  font-family: monospace;
  margin: 0;
  text-align: center;
  justify-content: center;
`

export const CursiveText = styled(Text.Black)`
  font-family: 'Goth';
  margin: 0;
  text-align: center;
  justify-content: center;
  width: 100%;
`

export const CursiveHeader = styled(CursiveText)`
  color: ${({ theme }) => theme.black};
  font-size: 6rem;
`
