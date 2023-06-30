import { Button, ExternalLink } from '@past3lle/components'
import { MediaWidths, setCssBackground } from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'
import styled, { css } from 'styled-components'

export * from './ConnectionInfoButton'
export * from './InventoryButton'
export * from './NetworkInfoButton'
export * from './ShopExternalLinkButton'
export * from './ThemeChangerButton'
export * from './OpenWeb3ModalButton'

export const ThemedButton = styled(Button).attrs(() => ({}))<{
  invert?: boolean
  gap?: string
  bgImage?: GenericImageSrcSet<MediaWidths>
  bgColor?: string
  bgBlendMode?: 'hard-light' | 'difference' | 'exclusion' | 'color-burn' | 'darken' | 'unset'
}>`
  background-color: ${({ theme, bgColor = theme.mainBg }) => bgColor};
  box-shadow: 4px 4px 1px 0px #000000bd;
  padding: 0rem 2rem;
  ${({ invert, theme, bgImage }) =>
    invert &&
    !bgImage &&
    `
    background-color: ${theme.mainText};
    > * { filter: invert(1); }
  `}
  ${({ gap }) => gap && `gap: ${gap};`}
  ${({ theme, bgColor = 'transparent', bgImage, bgBlendMode = 'difference' }) =>
    bgImage &&
    css`
      ${setCssBackground(theme, {
        imageUrls: [bgImage],
        backgroundColor: bgColor,
        backgroundBlendMode: bgBlendMode
      })}
    `}

    &:hover {
    box-shadow: 0px 0px 1px black;
    transform: translate(4px, 4px);
  }

  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
`

export const ThemedButtonExternalLink = styled(ExternalLink)<{
  disabled?: boolean
  fontSize?: string
  fullWidth?: boolean
}>`
  padding: 1rem 2rem;
  flex: 1;
  text-align: center;
  ${({ fontSize }) => fontSize && `font-size: ${fontSize};`}
  background-color: ${({ theme, disabled }) => (disabled ? theme.rarity.common.backgroundColor : theme.mainBg)};
  ${({ fullWidth }) => fullWidth && `width: 100%;`}

  ${({ disabled }) =>
    disabled &&
    ` 
      text-decoration: none;
      &:hover {
        text-decoration: none;
      } 
  `}
`

export const ThemedButtonActions = styled(ThemedButton)`
  padding: 1rem 2rem;
  flex: 1;
  text-align: center;
  box-shadow: none;
  border-radius: none;
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
