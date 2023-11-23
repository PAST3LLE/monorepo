import { proxy, subscribe as valtioSub } from 'valtio/vanilla'

import type { ModalPropsCtrlState } from './types/controllerTypes'

// -- initial state ------------------------------------------------ //
const state = proxy<ModalPropsCtrlState>({
  root: {
    connectorDisplayOverrides: {},
    closeModalOnConnect: false,
    openType: 'root',
    bypassScrollLock: false,
    appType: undefined
  },
  connect: {
    walletsView: 'list',
    hideInjectedFromRoot: false,
    error: null
  },
  account: {
    error: null
  },
  network: {
    error: null
  },
  hidDeviceOptions: {
    error: null,
    hidDeviceId: undefined
  }
})

// -- controller --------------------------------------------------- //
export const ModalPropsCtrl = {
  state,

  subscribe(callback: (newState: ModalPropsCtrlState) => void) {
    return valtioSub(state, () => callback(state))
  },
  update(props: Partial<ModalPropsCtrlState>) {
    state.root = {
      ...state.root,
      ...props.root
    }
    state.connect = {
      ...state.connect,
      ...props.connect
    }
    state.account = {
      ...state.account,
      ...props.account
    }
    state.network = {
      ...state.network,
      ...props.network
    }
    state.hidDeviceOptions = {
      ...state.hidDeviceOptions,
      ...props.hidDeviceOptions
    }
  }
}
