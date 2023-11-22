import { Column, ColumnCenter, Row } from '@past3lle/components'
import { upToExtraSmall } from '@past3lle/theme'
import styled, { css } from 'styled-components'

import { ModalButton, ModalContainer, ModalText, WalletsWrapper } from '../common/styled'

export const ModalHeaderText = styled(ModalText).attrs({ modal: 'hidDevice', node: 'header' })``
export const ModalSubHeaderText = styled(ModalText).attrs({ modal: 'hidDevice', node: 'subHeader' })``

export const HidModalContainer = styled(ModalContainer)`
  > ${Column}:first-child {
    flex: 0 1 100%;
    min-width: unset;
  }

  ${(props) => upToExtraSmall`
    ${ModalHeaderText} {
      font-size: calc(${props.theme.modals?.hidDevice?.text?.header?.size} * 0.8);
    }
    ${ModalSubHeaderText} {
      font-size: calc(${props.theme.modals?.hidDevice?.text?.subHeader?.size} * 0.8);
    }
  `}
`

export const HidModalWalletsWrapper = styled(WalletsWrapper)`
  overflow-y: auto;
  margin-bottom: 1rem;
  > div {
    > ${ModalButton} {
      background-color: ${(props) => props.theme?.modals?.account?.button?.main?.background};
      height: 40px;
      flex-flow: row nowrap;
      > img,
      > svg {
        max-height: 80%;
      }
    }
  }
`

const HidBaseRow = styled(Row).attrs({ minWidth: 550 })``

export const HidModalHeaderRow = styled(HidBaseRow)`
  border-bottom: 1px solid #f8f8ff42;
`

export const HidModalAddresseRow = styled(HidBaseRow)`
  cursor: pointer;

  width: 100%;
  border-radius: ${(props) => props.theme.modals?.base?.input?.border?.radius};
  color: ${(props) => props.theme.modals?.base?.font?.color};
  font-weight: 500;
  padding: 0.25rem 0;

  &:hover {
    background-color: ${(props) => props.theme.modals?.base?.background?.main};
  }
  transition: background-color 0.3s ease-in-out;
`

export const HidModalAddressPlaceholder = styled(Row)`
  color: ${(props) => props.theme.modals?.base?.font?.color};
  width: 100%;
  height: 100%;
  justify-content: center;
  text-align: center;
  font-size: 0.8rem;
  margin-top: 1rem;
`

export const HidModalAddressesList = styled(ColumnCenter)<{ zIndex?: number }>`
  z-index: ${({ zIndex = 1 }) => zIndex};
  background-color: ${({ theme }) => theme.modals?.base?.background?.main};
  border-radius: ${({ theme }) => theme.modals?.hidDevice?.container?.main?.border?.radius};
  align-items: start;
  overflow: hidden;
  overflow-x: auto;
  min-height: 90px;
  padding: 1rem;

  ${upToExtraSmall`
    padding: 1rem 0.5rem;
  `}

  > ${Row} {
    > strong {
      font-weight: 100;
      font-size: 0.85em;

      &:first-child {
        width: 65%;
      }
      &:nth-child(2) {
        width: 25%;
      }
      &:last-child {
        width: 10%;
      }
    }
  }
`

const BASE_INPUT_STYLES = css`
  font-family: inherit;
  font-size: 1em;
  font-variation-settings: 'wght' 100;
  padding: 0.5rem 37px 0.5rem 0.5rem;
  background-color: ${(props) => props.theme.modals?.base?.input?.background};
  color: ${(props) => props.theme.modals?.base?.font?.color};
  outline: none;
  border: ${(props) => props.theme.modals?.base?.input?.border?.border};
  border-radius: ${(props) => props.theme.modals?.base?.input?.border?.radius};
`

export const HidModalTextInput = styled.input<{ minWidth?: string; fontWeight?: number }>`
  ${BASE_INPUT_STYLES}
  font-weight: ${(props) => props.fontWeight || 100};
  font-variation-settings: 'wght' ${(props) => props.fontWeight || 100};
  letter-spacing: -1px;

  ${upToExtraSmall`
    min-width: unset;
  `}

  &:before {
    content: "m/44'/60'/";
  }
`

export const PathSelectAndInputContainer = styled(Row)<{ fontWeight?: number }>`
  > ${Column}:first-child, > ${Row}:first-child {
    transition: flex 0.3s ease-in-out, background-color 0.7s ease-in-out;
    overflow-x: hidden;

    > ${Column} > ${ModalText} {
      white-space: nowrap;
    }
  }
  select {
    ${BASE_INPUT_STYLES}
    cursor: pointer;
    text-transform: uppercase;
    font-weight: ${(props) => props.fontWeight || 100};
    font-variation-settings: 'wght' ${(props) => props.fontWeight || 100};
  }
`

export const HighlightedModalText = styled(ModalText).attrs((props) => ({
  modal: 'hidDevice',
  node: 'main',
  title: 'current-path',
  marginLeft: '5px',
  padding: '0.1rem 0.25rem 0.1rem 0.2rem',
  ...props
}))<{ backgroundColor?: string; color?: string }>`
  text-transform: initial;
  font-variation-settings: 'wght' 300;
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
`

export const UnderlinedModalTextCTA = styled(ModalText).attrs({
  modal: 'hidDevice',
  node: 'small',
  minWidth: 'max-content',
  fontSize: 'smaller',
  justifyContent: 'center'
})`
  cursor: pointer;
  text-decoration: underline;
  text-transform: initial;
`
