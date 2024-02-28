import { proxy, subscribe as valtioSub } from 'valtio/vanilla'

import { RouterCtrl } from './RouterCtrl'
import type { ModalCtrlState } from './types'

// -- types -------------------------------------------------------- //
export interface OpenOptions {
  uri?: string
  standaloneChains?: string[]
  /**
   * Adds to the history stack and allows to go back/forward
   * @default undefined - will replace stack. no history.
   */
  withHistory?: boolean
  route?:
    | 'Account'
    | 'ConnectWallet'
    | 'Help'
    | 'SelectNetwork'
    | 'HidDeviceOptions'
    | 'ConnectorConfigType'
    | 'ConnectionApproval'
    | 'Transactions'
}

// -- initial state ------------------------------------------------ //
const state = proxy<ModalCtrlState>({
  open: false,
  error: undefined
})

// -- controller --------------------------------------------------- //
export const ModalCtrl = {
  state,
  subscribe(callback: (newState: ModalCtrlState) => void) {
    return valtioSub(state, () => callback(state))
  },
  async open(options?: OpenOptions): Promise<void> {
    return new Promise<void>((resolve) => {
      state.open = false

      if (options?.route) {
        if (!!options?.withHistory) {
          RouterCtrl.push(options.route)
        } else {
          RouterCtrl.replace(options.route)
        }
      } else {
        RouterCtrl.replace('ConnectWallet')
      }

      state.open = true
      resolve()
    })
  },
  close() {
    state.open = false
  },
  setError(error: Error) {
    state.error = error
  },
  resetError() {
    state.error = undefined
  }
}
