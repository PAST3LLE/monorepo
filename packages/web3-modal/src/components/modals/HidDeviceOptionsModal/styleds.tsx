import { Column, ColumnCenter, Row } from '@past3lle/components'
import { upToExtraSmall } from '@past3lle/theme'
import styled from 'styled-components'

import { AccountBottomColumnContainer } from '../AccountModal/styled'
import { ModalButton, WalletsWrapper } from '../common/styled'

export const HidModalContainer = styled(AccountBottomColumnContainer)`
  > ${Column}:first-child {
    flex: 0 1 100%;
  }
`

export const HidModalWalletsWrapper = styled(WalletsWrapper)`
  > div {
    > ${ModalButton} {
      background-color: ${(props) => props.theme?.modals?.account?.button?.['explorer']?.background?.background};
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
  color: ${(props) => props.theme.modals?.base?.font?.color};
  font-weight: 500;
  padding: 0.25rem 0;

  &:hover {
    background-color: #848aff4d;
  }
  transition: background-color 0.3s ease-in-out;
`

export const HidModalAddressesList = styled(ColumnCenter)<{ zIndex?: number }>`
  z-index: ${({ zIndex = 1 }) => zIndex};
  background-color: #5a5a5a78;
  border-radius: ${(props) => props.theme.modals?.account?.container.addressAndBalance.border?.radius};
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

export const HidModalTextInput = styled.input`
  font-size: 1em;
  font-weight: 100;
  padding: 0.5rem;
  min-width: 300px;
  background: ${(props) => props.theme.modals?.base?.input?.background?.backgroundImg};
  background-color: ${(props) => props.theme.modals?.base?.input?.background?.background};
  color: ${(props) => props.theme.modals?.base?.font?.color};
  outline: none;
  border: ${(props) => props.theme.modals?.base?.input?.border?.border};
  border-radius: ${(props) => props.theme.modals?.base?.input?.border?.radius};
  cursor: pointer;
`

export const PathSelectAndInputContainer = styled(Row)`
  select {
    font-size: 1em;
    font-weight: 100;
    padding: 0.5rem 37px 0.5rem 0.5rem;
    background-color: ${(props) => props.theme.modals?.base?.input?.background?.background};
    color: ${(props) => props.theme.modals?.base?.font?.color};
    outline: none;
    border: ${(props) => props.theme.modals?.base?.input?.border?.border};
    border-radius: ${(props) => props.theme.modals?.base?.input?.border?.radius};
    cursor: pointer;
  }
`
