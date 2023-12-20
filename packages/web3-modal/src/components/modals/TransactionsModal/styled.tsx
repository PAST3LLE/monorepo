import {
  Column,
  ColumnCenter,
  type ArrowLeft as Icon,
  Row,
  RowBetween,
  RowCenter,
  Slash,
  SpinnerCircle,
  ThumbsUp
} from '@past3lle/components'
import React from 'react'
import { AnyTransactionReceipt } from 'src/controllers/TransactionsCtrl/types'
import styled from 'styled-components'

import { HidModalTextInput } from '../HidDeviceOptionsModal/styleds'
import { ModalText, WalletsWrapper } from '../common/styled'

export const SafeConfirmationSquareGradient = styled(Column)<{ borderColor?: string; gradientColor?: string }>`
  background: linear-gradient(250deg, black 60%, ${(props) => props.gradientColor});
  border: 3px solid ${(props) => props.borderColor};

  transition: background 300ms ease-in-out, border 300ms ease-in-out;
`
export const SafeConfirmationSquare = styled(Row)<{ disabled?: boolean }>`
  filter: ${(props) => (props.disabled ? 'grayscale(1) brightness(0.5)' : 'grayscale(0) brightness(1)')};
  transition: filter 750ms ease-out;
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

// const SAFE_GREEN = '#12ff80'
// const SAFE_GREEN_LIGHTER = '#76f3b0b0'
const SAFE_GREEN_MINTIER = '#4def98'

export function statusToCardBgColor(status: AnyTransactionReceipt['status']) {
  switch (status) {
    case 'success':
      return 'linear-gradient(45deg,#000000ba 60%,#062e1dd4)'
    case 'reverted':
      return 'linear-gradient(45deg,#000000ba 40%,#2c0e0ebd)'
    default:
      return '#00000091'
  }
}

export function statusToConfirmationSpecialColors(status: AnyTransactionReceipt['status']) {
  switch (status) {
    case 'success':
      return { gradientColor: SAFE_GREEN_MINTIER, borderColor: SAFE_GREEN_MINTIER }
    default:
      return { gradientColor: 'gray', borderColor: 'gray' }
  }
}

export function statusToPillProps(status: AnyTransactionReceipt['status']): PillProps {
  switch (status) {
    case 'success':
    case 'replaced-success':
      return {
        backgroundColor: '#708c7e',
        color: 'ghostwhite',
        Icon: ThumbsUp
      }
    case 'reverted':
      return {
        backgroundColor: '#994e4e',
        color: 'ghostwhite',
        tooltip: {
          text: 'Transaction was not confirmed. This may mean the transaction reverted, cancelled, or overwritten by another transaction e.g speed-up',
          backgroundColor: '#c03838'
        },
        Icon: Slash
      }
    case 'pending':
    case 'replaced-pending':
      return {
        backgroundColor: '#657bb9a8',
        color: 'ghostwhite',
        Icon: (() => <SpinnerCircle stroke="white" />) as any
      }
  }
}

export const SubheaderText = styled(ModalText).attrs({ modal: 'transactions', node: 'subHeader' })``
export const MainText = styled(ModalText).attrs({ modal: 'transactions', node: 'main' })``
export const SmallText = styled(ModalText).attrs({ modal: 'transactions', node: 'small' })``
export const StrongText = styled(ModalText).attrs({ modal: 'transactions', node: 'strong' })``