import { usePstlConnection } from '@past3lle/web3-modal'
import { useMemo } from 'react'

import { useForgeBalancesReadAtom } from '../state'
import { SkillMetadata } from '../types'
import { getLockStatus } from '../utils'

export function useDeriveSkillState(skillMetadata?: SkillMetadata) {
  const [, , { address }] = usePstlConnection()
  const [balances] = useForgeBalancesReadAtom()

  return useMemo(() => getLockStatus(skillMetadata, balances, address), [address, balances, skillMetadata])
}
