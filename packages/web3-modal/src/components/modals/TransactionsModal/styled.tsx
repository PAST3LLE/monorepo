import { Column, type ArrowLeft as Icon, RowBetween, RowCenter } from '@past3lle/components'
import styled from 'styled-components'

import { HidModalTextInput } from '../HidDeviceOptionsModal/styleds'
import { ModalText } from '../common/styled'

export const TransactionRow = styled(RowBetween)`
  gap: 1rem;
  border-bottom: 1px solid #ffffff21;

  > * {
    font-size: 1.2em;
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
