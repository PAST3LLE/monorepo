import { MediaWidths, ThemeProvider, setBackgroundWithDPI, setBestContrastingColour } from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'
import { darken, transparentize } from 'polished'
import React from 'react'
import styled, { DefaultTheme, FlattenInterpolation, ThemeProps, css } from 'styled-components'

import { Row, RowProps } from '../Layout'
import { pastelleTheme } from '../theme'

export interface ButtonBaseProps {
  buttonVariant?: ButtonVariations
  buttonSize?: ButtonSizeVariations
}

export enum ButtonVariations {
  DEFAULT = 'DEFAULT',
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  DANGER = 'DANGER',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  CANCEL = 'CANCEL',
  DISABLED = 'DISABLED',
  THEME = 'THEME',
  DARK_MODE_TOGGLE = 'DARK_MODE_TOGGLE'
}

export enum ButtonSizeVariations {
  DEFAULT = 'DEFAULT',
  SMALL = 'SMALL',
  BIG = 'BIG'
}

// Aliases
export const BV = ButtonVariations
export const BSV = ButtonSizeVariations

const DEFAULT_DARKEN_AMOUNT = 0.2

const PRIMARY_BUTTON_STYLES = css`
  color: ${({ theme }): string => theme.content.text};
  background: ${({ theme }): string => theme.content.background};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.content.background)};
  }
`

const SECONDARY_BUTTON_STYLES = css`
  color: ${({ theme }): string =>
    setBestContrastingColour({
      bgColour: theme.purple3,
      fgColour: theme.offwhite,
      lightColour: theme.offwhite,
      darkColour: theme.black
    })};
  background: ${({ theme }): string => theme.purple3};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.purple2)};
  }
`

const DARK_MODE_TOGGLE_STYLES = css`
  color: ${({ theme }): string =>
    setBestContrastingColour({
      bgColour: theme.modeToggle,
      fgColour: theme.offwhite,
      lightColour: theme.offwhite,
      darkColour: theme.black
    })};
  background: ${({ theme }): string => theme.modeToggle};

  svg {
    stroke: ${({ theme }) => theme.modeSvg};
    fill: ${({ theme }) => theme.modeSvg};
  }
`

const DANGER_BUTTON_STYLES = css`
  color: ${({ theme }): string =>
    setBestContrastingColour({
      bgColour: theme.red2,
      fgColour: theme.red1,
      lightColour: theme.red1,
      darkColour: theme.black
    })};
  background: ${({ theme }): string => theme.red2};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.red2)};
    border-color: ${({ theme }): string => theme.red1};
  }
`

const SUCCESS_BUTTON_STYLES = css`
  color: ${({ theme }): string =>
    setBestContrastingColour({
      bgColour: theme.green2,
      fgColour: theme.green1,
      lightColour: theme.green1,
      darkColour: theme.black
    })};
  background: ${({ theme }): string => theme.green2};

  &:hover {
    background: linear-gradient(270deg, #8958ff 0%, #3f77ff 100%);
    border-color: ${({ theme }): string => theme.offwhite};
    color: ${({ theme }): string => theme.offwhite};
  }

  transition: background, color 0.3s ease-out;
`

const WARNING_BUTTON_STYLES = css`
  color: ${({ theme }): string =>
    setBestContrastingColour({
      bgColour: theme.yellow2,
      fgColour: theme.yellow1,
      lightColour: theme.yellow1,
      darkColour: theme.black
    })};
  background: ${({ theme }): string => theme.yellow2};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.yellow2)};
    border-color: ${({ theme }): string => theme.yellow1};
  }
`

const CANCEL_BUTTON_STYLES = css`
  color: ${({ theme }): string =>
    setBestContrastingColour({
      bgColour: theme.bg1,
      fgColour: theme.text3,
      lightColour: theme.text3,
      darkColour: theme.black
    })};
  background: ${({ theme }): string => theme.bg1};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.bg1)};
    border-color: ${({ theme }): string => theme.text3};
  }
`

const DISABLED_BUTTON_STYLES = css`
  color: ${({ theme }): string =>
    setBestContrastingColour({
      bgColour: theme.bgDisabled,
      fgColour: theme.textDisabled,
      lightColour: theme.textDisabled,
      darkColour: theme.black
    })};
  background: ${({ theme }): string => theme.bgDisabled};

  &:hover {
    background: ${({ theme }): string => darken(DEFAULT_DARKEN_AMOUNT, theme.bgDisabled)};
    border-color: ${({ theme }): string => theme.textDisabled};
  }
`

const THEME_BUTTON_STYLES = css`
  color: ${({ theme }): string =>
    setBestContrastingColour({
      bgColour: theme.black,
      fgColour: theme.offwhite,
      lightColour: theme.offwhite,
      darkColour: theme.black
    })};
  border-color: ${({ theme }): string => theme.offwhite};

  filter: contrast(1.5) saturate(10);

  border-color: ${({ theme }): string => theme.text1};
  text-shadow: 0px 0px 12px #fff;

  > div {
    filter: ${({ theme: { mode } }) => `invert(${mode === 'DARK' ? 1 : 1})`};

    border-radius: 0.1rem;

    background-color: ${({ theme }) => theme.black};
    opacity: 0.66;

    transition: background-color, filter, opacity 0.2s ease-out;
  }

  &:hover {
    filter: ${({ theme: { mode } }) => (mode === 'DARK' ? 'contrast(1.5) saturate(10)' : 'contrast(2) saturate(3)')};

    border-color: ${({ theme }): string => theme.text1};

    > div {
      filter: ${({ theme: { mode } }) => `invert(${mode === 'DARK' ? 0 : 1})`};
    }
  }

  transition: text-shadow, background-color, filter 0.2s ease-in-out;
`

const getButtonVariantStyles = (buttonVariant: ButtonVariations): FlattenInterpolation<ThemeProps<DefaultTheme>> => {
  switch (buttonVariant) {
    case ButtonVariations.DEFAULT:
      return PRIMARY_BUTTON_STYLES

    case ButtonVariations.PRIMARY:
      return PRIMARY_BUTTON_STYLES

    case ButtonVariations.SECONDARY:
      return SECONDARY_BUTTON_STYLES

    case ButtonVariations.DARK_MODE_TOGGLE:
      return DARK_MODE_TOGGLE_STYLES

    case ButtonVariations.DANGER:
      return DANGER_BUTTON_STYLES

    case ButtonVariations.SUCCESS:
      return SUCCESS_BUTTON_STYLES

    case ButtonVariations.WARNING:
      return WARNING_BUTTON_STYLES

    case ButtonVariations.CANCEL:
      return CANCEL_BUTTON_STYLES

    case ButtonVariations.DISABLED:
      return DISABLED_BUTTON_STYLES

    case ButtonVariations.THEME:
      return THEME_BUTTON_STYLES
  }
}

// Created a 'size' prop on button, default | small | big
const ButtonSizes = {
  DEFAULT: css`
    font-size: ${({ theme }) => theme.button.fontSize.normal};
    padding: 0.5rem 1rem;
  `,
  SMALL: css`
    font-size: ${({ theme }) => theme.button.fontSize.small};
    padding: 0.3rem 1rem;
  `,
  BIG: css`
    font-size: ${({ theme }) => theme.button.fontSize.large};
    padding: 0.65rem 1.2rem;
  `
}

type CustomButtonStyleProps = {
  borderRadius?: string
  gradientColours?: string[]
  bgBlendMode?:
    | 'lighten'
    | 'difference'
    | 'color'
    | 'color-burn'
    | 'exclusion'
    | 'saturation'
    | 'hard-light'
    | 'soft-light'
    | 'screen'
    | 'multiply'
  bgAttributes?: [string, string]
  backgroundColor?: string
  filter?: string
}

export type ButtonProps = RowProps &
  ButtonBaseProps &
  CustomButtonStyleProps & { bgImage?: GenericImageSrcSet<MediaWidths> }

const ButtonBase = styled(Row)`
  border-radius: ${({ borderRadius = '0.5rem' }) => borderRadius};

  width: auto;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  cursor: pointer;
  outline: 0;

  transition-duration: 0.2;
  transition-timing-function: ease-in-out;
  transition-property: color, background, background-color, border-color, opacity, margin;

  &:disabled,
  &[disabled] {
    pointer-events: none;
    background-color: #292928;
  }
`

export const Button = styled(ButtonBase)<ButtonProps>`
  /* Size buttonVariant */
  ${({ buttonVariant }) => buttonVariant && getButtonVariantStyles(buttonVariant)}
  /* Fold in theme css above */
  ${({ buttonSize }) => buttonSize && ButtonSizes[buttonSize]};

  ${({ backgroundColor, bgImage }) => !bgImage && backgroundColor && `background-color: ${backgroundColor};`}
  ${({
    theme,
    bgImage,
    bgAttributes = ['center / cover no-repeat', '5px / cover repeat'],
    bgBlendMode = 'difference',
    backgroundColor = transparentize(0.3, theme.black)
  }) =>
    bgImage &&
    setBackgroundWithDPI(theme, bgImage, {
      backgroundColor,
      backgroundAttributes: bgAttributes,
      backgroundBlendMode: bgBlendMode,
      ignoreQueriesWithFixedWidth: 500,
      skipIk: true
    })}

  filter: ${({ filter = 'unset' }) => `filter: ${filter}`};
`

export const PstlButton = styled(({ children, ...buttonProps }: ButtonProps) => {
  return (
    <ThemeProvider theme={pastelleTheme} defaultMode="DARK">
      <Button {...buttonProps}>{children}</Button>
    </ThemeProvider>
  )
})``
