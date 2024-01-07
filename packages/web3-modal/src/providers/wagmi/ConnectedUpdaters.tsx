import { devDebug } from '@past3lle/utils'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { useSwitchNetwork } from 'wagmi'

import { UserOptionsCtrl } from '../../controllers'
import { UserOptionsCtrlState } from '../../controllers/types'
import { useUserConnectionInfo } from '../../hooks'
import { SmartAutoConnectProps, useSmartAutoConnect } from '../../hooks/internal/useSmartAutoConnect'

function useSwitchChainOnLimitedChainsChange() {
  const uiSnap = useSnapshot<UserOptionsCtrlState['ui']>(UserOptionsCtrl.state.ui)
  const { chain } = useUserConnectionInfo()
  const chainId = chain?.id
  const { switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    const disconnectedOrChainMismatch = !chainId || !uiSnap.softLimitedChains?.some((c) => c.id === chainId)
    if (uiSnap.softLimitedChains?.length && !!switchNetwork && disconnectedOrChainMismatch) {
      devDebug('[useSwitchChainOnLimitedChainsChange] --> Detected change, switching!')
      switchNetwork(uiSnap.softLimitedChains[0].id)
    }
  }, [uiSnap.softLimitedChains, switchNetwork, chainId])
}

export function ConnectedUpdaters(props: SmartAutoConnectProps) {
  // Run auto connection logic e.g safe app or iframe, we auto connect
  useSmartAutoConnect(props)
  // Run auto chain switching on limit chains changes
  useSwitchChainOnLimitedChainsChange()

  return null
}
