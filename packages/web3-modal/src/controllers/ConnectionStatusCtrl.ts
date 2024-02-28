import { proxy, subscribe as valtioSub } from 'valtio/vanilla'
import { Config } from 'wagmi'
import { ConnectMutateAsync } from 'wagmi/query'

import type { ConnectionStatusCtrlState } from './types'

// -- initial state ------------------------------------------------ //
const state = proxy<ConnectionStatusCtrlState>({
  ids: [],
  status: 'idle',
  retry: undefined
})

// -- controller --------------------------------------------------- //
export const ConnectionStatusCtrl = {
  state,
  subscribe(callback: (newState: ConnectionStatusCtrlState) => void) {
    return valtioSub(state, () => callback(state))
  },
  setStatus(status: ConnectionStatusCtrlState['status']) {
    state.status = status
  },
  setConnectorIds(ids: string[]) {
    state.ids = ids
  },
  resetConnectorIds() {
    state.ids = []
  },
  async retryConnection(args: Parameters<ConnectMutateAsync<Config>>[0]) {
    return state.retry?.(args)
  },
  reset() {
    state.ids = []
    state.status = 'idle'
  },
  update(newState: Partial<ConnectionStatusCtrlState>) {
    if (newState?.ids) {
      state.ids = newState.ids
    }
    if (newState?.status) {
      state.status = newState.status
    }
    if (newState?.retry) {
      state.retry = newState.retry
    }
  }
}
