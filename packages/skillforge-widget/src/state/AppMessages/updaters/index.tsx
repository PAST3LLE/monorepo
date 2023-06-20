import { ForgeW3ChainState, useChainState, useForgeReadonlyChainAtom } from '@past3lle/forge-web3'
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
  const [readonlyChain] = useForgeReadonlyChainAtom()
  useEffect(() => {
    switch (chainState) {
      case ForgeW3ChainState.UNSUPPORTED: {
        setAppMessages({
          [AppMessagesKeys.UNSUPPORTED_CHAIN]:
            'Unsupported network! Click the network button above and switch to a supported network.'
        })
        break
      }
      case ForgeW3ChainState.READONLY: {
        setAppMessages({
          [AppMessagesKeys.READONLY]: `${
            readonlyChain?.name || 'App'
          } readonly mode active. Please login to view your active balances and skill inventory.`
        })
        break
      }
      default: {
        setAppMessages({ [AppMessagesKeys.UNSUPPORTED_CHAIN]: undefined, [AppMessagesKeys.READONLY]: undefined })
        break
      }
    }
  }, [readonlyChain?.name, chainState, setAppMessages])
}
