import { ButtonVariations, PstlButton, RowCenter, SpinnerCircle } from '@past3lle/components'
import { memo, useMemo } from 'react'
import React from 'react'

import { useModalActions } from '../../hooks'
import { usePendingTransactions } from '../../hooks/api/useTransactions'

function TransactionsButtonContent({ className }: { className?: string }) {
  const { onTransactionsClick } = useModalActions()
  const pendingTranscations = usePendingTransactions()
  const pendingLength = pendingTranscations?.length

  const content = useMemo(() => {
    if (pendingLength > 0) {
      return (
        <RowCenter gap="0.5rem">
          <SpinnerCircle size={20} />
          {pendingLength} PENDING TRANSACTIONS
        </RowCenter>
      )
    } else {
      return 'NO PENDING TRANSACTIONS'
    }
  }, [pendingLength])

  return (
    <PstlButton
      className={className}
      buttonVariant={ButtonVariations.SUCCESS}
      onClick={onTransactionsClick}
      justifyContent="center"
    >
      {content}
    </PstlButton>
  )
}

export const TransactionsButton = memo(TransactionsButtonContent)
