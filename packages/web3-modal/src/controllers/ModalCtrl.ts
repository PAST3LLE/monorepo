import { proxy, subscribe as valtioSub } from 'valtio/vanilla'

import { AccountCtrl } from './AccountCtrl'
import { ConfigCtrl } from './ConfigCtrl'
import { OptionsCtrl } from './OptionsCtrl'
import { RouterCtrl } from './RouterCtrl'
import type { ModalCtrlState } from './types/controllerTypes'

// -- types -------------------------------------------------------- //
export interface OpenOptions {
  uri?: string
  standaloneChains?: string[]
  route?: 'Account' | 'ConnectWallet' | 'Help' | 'SelectNetwork'
}

// -- initial state ------------------------------------------------ //
const state = proxy<ModalCtrlState>({
  open: false
})

// -- controller --------------------------------------------------- //
export const ModalCtrl = {
  state,

  subscribe(callback: (newState: ModalCtrlState) => void) {
    return valtioSub(state, () => callback(state))
  },

  async open(options?: OpenOptions) {
    return new Promise<void>((resolve) => {
      state.open = false

      const { isStandalone } = OptionsCtrl.state
      const { isConnected } = AccountCtrl.state
      const { enableNetworkView } = ConfigCtrl.state

      if (isStandalone) {
        OptionsCtrl.setStandaloneUri(options?.uri)
        OptionsCtrl.setStandaloneChains(options?.standaloneChains)
        RouterCtrl.replace('ConnectWallet')
      } else if (options?.route) {
        RouterCtrl.replace(options.route)
      } else if (isConnected) {
        RouterCtrl.replace('Account')
      } else if (enableNetworkView) {
        RouterCtrl.replace('SelectNetwork')
      } else {
        RouterCtrl.replace('ConnectWallet')
      }

      state.open = true
      resolve()
    })
  },

  close() {
    state.open = false
  }
}
