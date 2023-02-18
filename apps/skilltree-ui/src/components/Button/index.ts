import { Button, ExternalLink } from '@past3lle/components'
import { setCssBackground } from '@past3lle/theme'
import styled, { css } from 'styled-components/macro'
import { BACKGROUND_IMAGE_DDPX_URL_MAP } from 'theme/global'

export * from './InventoryButton'
export * from './Web3Button'

export const ThemedButton = styled(Button).attrs(() => ({}))<{ invert?: boolean; gap?: string; withBgImage?: boolean }>`
  background-color: ${({ theme }) => theme.mainBg};
  box-shadow: 4px 4px 1px 0px #000000bd;
  padding: 0rem 2rem;
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
    css`
      ${setCssBackground(theme, {
        imageUrls: [BACKGROUND_IMAGE_DDPX_URL_MAP],
        backgroundColor: '#422548',
        backgroundBlendMode: 'difference'
      })}
    `}

    &:hover {
    box-shadow: 0px 0px 1px black;
    transform: translate(4px, 4px);
  }

  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
`

export const ThemedButtonExternalLink = styled(ExternalLink)<{ disabled?: boolean }>`
  padding: 1rem 2rem;
  flex: 1;
  text-align: center;
  background-color: ${({ theme, disabled }) => (disabled ? theme.rarity.common.backgroundColor : theme.mainBg)};
  ${({ disabled }) =>
    disabled &&
    ` 
      text-decoration: none;
      &:hover {
        text-decoration: none;
      } 
  `}
`
