import { useCallback } from 'react'

import { UserOptionsCtrl } from '../../controllers'
import { ReadonlyChains } from '../../providers/types'

/**
 * @name useLimitChainsAndSwitchCallback
 * @description Manually set the soft limiting chains. Will trigger an auto-chain switch if the chains differ.
 * @returns void
 */
export function useLimitChainsAndSwitchCallback() {
  return useCallback((chains: ReadonlyChains) => {
    if (!UserOptionsCtrl.state.ui?.softLimitedChains?.length) {
      UserOptionsCtrl.state.ui.softLimitedChains = []
    }
    UserOptionsCtrl.state.ui.softLimitedChains = chains
  }, [])
}
