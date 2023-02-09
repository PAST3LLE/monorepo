import { Button, ExternalLink } from '@past3lle/components'
import styled from 'styled-components/macro'

export const ThemedButton = styled(Button).attrs({ padding: '2rem 4rem' })`
  background-color: ${({ theme }) => theme.mainBg};
`

export const ThemedButtonExternalLink = styled(ExternalLink)`
  padding: 2rem 4rem;
  background-color: ${({ theme }) => theme.mainBg};
`
