import { ButtonProps, ButtonVariations, PstlButton, RowCenter, SpinnerCircle } from '@past3lle/components'
import { ReactNode, memo, useMemo } from 'react'
import React from 'react'

import { useModalActions } from '../../hooks'
import { usePendingTransactions } from '../../hooks/api/useTransactions'

interface Props {
  className?: string
  children?: ReactNode
}
function TransactionsButtonContent({ className, children, ...buttonProps }: Props & ButtonProps) {
  const { onTransactionsClick } = useModalActions()
  const pendingTranscations = usePendingTransactions()
  const pendingLength = pendingTranscations?.length

  const content = useMemo(() => {
    if (pendingLength > 0) {
      return (
        <RowCenter gap="0.5rem">
          <SpinnerCircle size={20} />
          {pendingLength} {children}
        </RowCenter>
      )
    } else {
      return <RowCenter gap="0.5rem">{children}</RowCenter>
    }
  }, [pendingLength, children])

  return (
    <PstlButton
      className={className}
      buttonVariant={ButtonVariations.DEFAULT}
      onClick={onTransactionsClick}
      justifyContent="center"
      {...buttonProps}
    >
      {content}
    </PstlButton>
  )
}

/**
 * @name TransactionsButton
 * @description Syntactic sugar UI button for accessing transactions modal
 * @note As this is potentially renderable OUTSIDE the modal (before it's mounted) it does not use the web3-modal theme. Use props instead.
 */
export const TransactionsButton = memo(TransactionsButtonContent)
