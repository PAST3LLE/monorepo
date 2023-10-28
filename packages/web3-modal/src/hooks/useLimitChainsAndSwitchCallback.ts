import { useCallback } from 'react'
import { Chain } from 'viem'

import { ModalPropsCtrl } from '../controllers'

/**
 * @name useLimitChainsAndSwitchCallback
 * @description Manually set the soft limiting chains. Will trigger an auto-chain switch if the chains differ.
 * @returns void
 */
export function useLimitChainsAndSwitchCallback() {
  return useCallback((chains: Chain[]) => {
    if (!ModalPropsCtrl.state.root?.softLimitedChains?.length) {
      ModalPropsCtrl.state.root.softLimitedChains = []
    }
    ModalPropsCtrl.state.root.softLimitedChains = chains
  }, [])
}
