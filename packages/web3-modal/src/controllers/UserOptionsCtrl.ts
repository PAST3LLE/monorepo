import { proxy, subscribe as valtioSub } from 'valtio/vanilla'

import type { UserOptionsCtrlState } from './types/controllerTypes'

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
  connectors: {
    hideInjectedFromRoot: false,
    overrides: {}
  }
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
    state.connectors = {
      ...state.connectors,
      ...props.connectors
    }
  }
}
