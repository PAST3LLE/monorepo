import { ForgeW3ChainState, useChainState } from '@past3lle/forge-web3'
import { useEffect } from 'react'

import { AppMessagesKeys, useAppMessagesAtom } from '..'

export function AppMessagesUpdater() {
  // CHAIN STATE MESSAGES
  // e.g user is connected to an unsupported network
  useSetChainStateMessages()

  return null
}

function useSetChainStateMessages() {
  const [, setAppMessages] = useAppMessagesAtom()
  const [, chainState] = useChainState()
  useEffect(() => {
    if (chainState === ForgeW3ChainState.UNSUPPORTED) {
      setAppMessages([
        AppMessagesKeys.UNSUPPORTED_CHAIN,
        'Unsupported network! Click the network button above and switch to a supported network.'
      ])
    } else {
      setAppMessages([AppMessagesKeys.UNSUPPORTED_CHAIN, undefined])
    }
  }, [chainState, setAppMessages])
}
