import { useCallback } from 'react'
import { Chain } from 'viem'

import { UserOptionsCtrl } from '../../controllers'

/**
 * @name useLimitChainsAndSwitchCallback
 * @description Manually set the soft limiting chains. Will trigger an auto-chain switch if the chains differ.
 * @returns void
 */
export function useLimitChainsAndSwitchCallback() {
  return useCallback((chains: Chain[]) => {
    if (!UserOptionsCtrl.state.ui?.softLimitedChains?.length) {
      UserOptionsCtrl.state.ui.softLimitedChains = []
    }
    UserOptionsCtrl.state.ui.softLimitedChains = chains
  }, [])
}
