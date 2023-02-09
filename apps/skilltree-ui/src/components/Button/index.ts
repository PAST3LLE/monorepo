import { Button, ExternalLink } from '@past3lle/components'
import { setCssBackground } from '@past3lle/theme'
import styled from 'styled-components/macro'
import { BACKGROUND_IMAGE_DDPX_URL_MAP } from 'theme/global'

export const ThemedButton = styled(Button).attrs(() => ({}))<{ invert?: boolean; gap?: string; withBgImage?: boolean }>`
  background-color: ${({ theme }) => theme.mainBg};
  padding: 2rem 4rem;
  ${({ invert, theme, withBgImage }) =>
    invert &&
    !withBgImage &&
    `
    background-color: ${theme.blackOpaque1};
    > * { filter: invert(1); }
  `}
  ${({ gap }) => gap && `gap: ${gap};`}
  ${({ theme, withBgImage }) =>
    withBgImage &&
    `
    ${setCssBackground(theme, {
      imageUrls: [BACKGROUND_IMAGE_DDPX_URL_MAP, BACKGROUND_IMAGE_DDPX_URL_MAP],
      backgroundColor: '#422548',
      backgroundBlendMode: 'difference'
    })}
  `}
`

export const ThemedButtonExternalLink = styled(ExternalLink)`
  padding: 2rem 4rem;
  background-color: ${({ theme }) => theme.mainBg};
`
