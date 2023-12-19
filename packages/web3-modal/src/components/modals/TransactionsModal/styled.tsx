import { Column, ColumnCenter, type ArrowLeft as Icon, Row, RowBetween, RowCenter } from '@past3lle/components'
import styled from 'styled-components'

import { HidModalTextInput } from '../HidDeviceOptionsModal/styleds'
import { ModalText, WalletsWrapper } from '../common/styled'

export const SafeConfirmationSquare = styled(Row)<{ disabled?: boolean }>`
  filter: ${(props) => (props.disabled ? 'grayscale(1) brightness(0.5)' : 'unset')};
`
export const SafeConfirmationCardWrapper = styled(ColumnCenter)``
export const SafeConfirmationsGridWrapper = styled(WalletsWrapper)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`

export const TransactionRow = styled(RowBetween)<{ fontSize?: string; borderBottom?: string }>`
  gap: 1rem;
  border-bottom: ${({ borderBottom = '1px solid #ffffff21' }) => borderBottom};

  > * {
    font-size: ${(props) => props.fontSize || '1.2em'};
    letter-spacing: -1.6px;
    line-height: 1.4;
  }

  width: calc(100% - 7.5rem);
  & > *:last-child {
    margin-right: -7.5rem !important;
  }
`

export const TransactionTitle = styled(ModalText).attrs({ modal: 'base', node: 'subHeader' })``
export const TransactionWrapper = styled(Column)<{ background?: string }>`
  color: ghostwhite;
  background: ${(props) => props.background};

  justify-content: center;
  align-items: start;
  line-height: 1;

  padding: 1rem;

  border-radius: 10px;

  gap: 0;
`
export const TransactionsModalWrapper = styled(Column)`
  gap: 0.4rem;
  overflow-y: auto;
  padding: 0 0.7rem;

  a {
    color: ${(props) => props.theme.modals?.base?.title?.font?.color};
  }
`

export interface PillProps {
  backgroundColor: string
  color: string
  tooltip?: { text: string; backgroundColor: string }
  Icon?: typeof Icon
}
export const StatusPill = styled(RowCenter)<PillProps>`
  padding: 0;
  margin: 2px 0;
  border-radius: 2px;
  width: 110px;
  gap: 3px;

  > svg {
    width: 14px;
    height: 14px;
  }
  > ${ModalText} {
    font-family: monospace;
  }
`

export const TransactionInput = styled(HidModalTextInput)`
  width: 80%;
  margin: 0;
`
