import { Column, Text } from '@past3lle/components'
import React, { useCallback } from 'react'

import { ThemedButtonActions } from '../../Common/Button/common'

export function TradeAndUnlockActionButton({ handleClaim }: { handleClaim?: () => void }) {
  const handleCallback = useCallback(
    async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation()
      return handleClaim?.()
    },
    [handleClaim]
  )

  return (
    <Column justifyContent="center" gap="0.75rem" flex="1" minWidth={200} flexDirection="column-reverse">
      <ThemedButtonActions fontSize="2rem" disabled={!handleClaim} onClick={handleCallback}>
        <Text.Black fontWeight={300}>{'CONFIRM UPGRADE'}</Text.Black>
      </ThemedButtonActions>
    </Column>
  )
}
