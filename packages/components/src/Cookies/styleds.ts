import { Z_INDICES } from '@past3lle/constants'
import { upToSmall } from '@past3lle/theme'
import { transparentize } from 'polished'
import styled from 'styled-components'

import { ColumnCenter, Row } from '../Layout'
import { Text as LayoutText } from '../Text'
import { CookieStyles } from './types'

export const CookieSubHeader = styled(LayoutText.SubHeader)`
  color: ${({ theme }) => theme.content.text};
`
export const CookieSubDescription = styled(LayoutText.Black)`
  color: ${({ theme }) => theme.content.text};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`

export const CheckboxRow = styled(Row)``
export const CookieFullText = styled(CookieSubDescription)``
export const CookieCheckbox = styled.input.attrs((props) => ({
  type: 'checkbox',
  ...props
}))`
  cursor: pointer;
  z-index: ${Z_INDICES.BEHIND};
`
export const CookiesText = styled(CookieSubDescription).attrs({
  margin: 0,
  backgroundColor: 'transparent'
})`
  gap: 1rem;
`

export const CookieContainer = styled.div<CookieStyles>`
  display: grid;
  grid-template-columns: auto;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: ${Z_INDICES.COOKIE_BANNER};
  touch-action: none;
  height: 80vh;

  overflow: auto;

  > ${ColumnCenter} {
    gap: 2rem;
    padding: 2rem;
    background-color: ${({ theme, $bg = theme.blackOpaque }) => $bg};
  }

  input[type='checkbox'] {
    z-index: 999;
    position: relative;

    appearance: none;
    background-color: ${({ theme, $text = theme.offwhite }) => $text};
    margin: 0;
    font: inherit;
    color: currentColor;
    width: 1.15em;
    height: 1.15em;
    border: 0.15em solid currentColor;
    border-radius: 0.15em;
    transform: translateY(-0.075em);

    display: grid;
    place-content: center;

    &::before {
      content: '';
      width: 0.85em;
      height: 0.85em;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
      box-shadow: ${({ $checkbox = '#713de4' }) => `inset 1em 1em ${$checkbox}`};
    }

    &:checked::before {
      transform: scale(1);
    }
  }

  > * {
    padding: 1rem 0;
    color: ${({ theme, $text = theme.offwhite }) => $text};
  }

  ${CookieSubHeader} {
    font-size: 2.8rem;
  }

  ${CookiesText}, ${CookieSubDescription} {
    font-size: 2rem;
  }

  ${CookieFullText} {
    border-radius: 5px;
    background-color: ${({ theme, $bgAlt = transparentize(0.21, theme.content.background) }) => $bgAlt};
    min-height: 250px;
    width: auto;
    max-width: 80%;

    ${upToSmall`
      max-width: 100%;
    `}
  }

  ${CheckboxRow} {
    // max-width: min-content;
    justify-self: center;
    padding: 2rem;

    > ${CookiesText} {
      flex: 0 1 auto;
      justify-content: space-between;

      &#checkbox_essential {
        pointer-events: none;
      }

      ${upToSmall`
        flex: 1 auto;
      `}
    }
  }

  ${({ $customCss }) => $customCss && $customCss}
`
