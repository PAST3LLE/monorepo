import { proxy, subscribe as valtioSub } from 'valtio/vanilla'

import type { UserOptionsCtrlState } from './types'

// -- initial state ------------------------------------------------ //
const state = proxy<UserOptionsCtrlState>({
  ux: {
    appType: undefined,
    bypassScrollLock: false,
    closeModalOnConnect: false
  },
  ui: {
    chainImages: undefined,
    softLimitedChains: undefined,
    walletsView: 'list'
  },
  chains: {
    blockExplorerUris: undefined
  },
  connectors: {
    hideInjectedFromRoot: false,
    overrides: {}
  },
  transactions: undefined
})

// -- controller --------------------------------------------------- //
export const UserOptionsCtrl = {
  state,

  subscribe(callback: (newState: UserOptionsCtrlState) => void) {
    return valtioSub(state, () => callback(state))
  },
  update(props: Partial<UserOptionsCtrlState>) {
    state.ux = {
      ...state.ux,
      ...props.ux
    }
    state.ui = {
      ...state.ui,
      ...props.ui
    }
    state.chains = {
      ...state.chains,
      ...props.chains
    }
    state.connectors = {
      ...state.connectors,
      ...props.connectors
    }
    state.transactions = {
      ...state.transactions,
      ...props.transactions
    }
  }
}
