import { devDebug } from '@past3lle/utils'
import { useEffect } from 'react'
import { ModalPropsCtrl } from '../../controllers'
import { useSnapshot } from 'valtio'
import { useSwitchNetwork } from 'wagmi'
import { SmartAutoConnectProps, useSmartAutoConnect } from '../../hooks/useSmartAutoConnect'
import { useUserConnectionInfo } from '../../hooks'

function useSwitchChainOnLimitedChainsChange() {
  const rootSnap = useSnapshot(ModalPropsCtrl.state.root)
  const { chain } = useUserConnectionInfo()
  const { switchNetwork } = useSwitchNetwork()
  
  useEffect(() => {
    const disconnectedOrChainMismatch = (!chain?.id || chain.id !== rootSnap.softLimitedChains?.[0]?.id)
    if (rootSnap.softLimitedChains?.length && !!switchNetwork && disconnectedOrChainMismatch){
      devDebug('[useSwitchChainOnLimitedChainsChange] --> Detected change, switching!')
      switchNetwork(rootSnap.softLimitedChains[0].id)
    }
  }, [rootSnap.softLimitedChains, switchNetwork])
}

export function ConnectedUpdaters(props: SmartAutoConnectProps) {
  // Run auto connection logic e.g safe app or iframe, we auto connect
  useSmartAutoConnect(props)
  // Run auto chain switching on limit chains changes
  useSwitchChainOnLimitedChainsChange()

  return null
}
