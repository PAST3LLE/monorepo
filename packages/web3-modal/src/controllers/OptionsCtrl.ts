import { proxy, subscribe as valtioSub } from 'valtio/vanilla'
import { Chain } from 'wagmi'

import { ClientCtrl } from './ClientCtrl'
import type { OptionsCtrlState } from './types/controllerTypes'

// -- initial state ------------------------------------------------ //
const state = proxy<OptionsCtrlState>({
  selectedChain: undefined,
  chains: undefined,
  standaloneChains: undefined,
  standaloneUri: undefined,
  isStandalone: false,
  isCustomDesktop: false,
  isCustomMobile: false,
  isDataLoaded: false,
  isUiLoaded: false,
  walletConnectVersion: 1
})

type OptionsCtrl = {
  state: OptionsCtrlState
  subscribe: (callback: (newState: OptionsCtrlState) => void) => () => void
  setChains(chains?: OptionsCtrlState['chains']): void
  setStandaloneChains(standaloneChains: OptionsCtrlState['standaloneChains']): void
  setStandaloneUri(standaloneUri: OptionsCtrlState['standaloneUri']): void
  getSelectedChain(): Chain | undefined
  setIsStandalone(isStandalone: OptionsCtrlState['isStandalone']): void
  setSelectedChain(selectedChain: OptionsCtrlState['selectedChain']): void
  setIsCustomDesktop(isCustomDesktop: OptionsCtrlState['isCustomDesktop']): void
  setIsCustomMobile(isCustomMobile: OptionsCtrlState['isCustomMobile']): void
  setIsDataLoaded(isDataLoaded: OptionsCtrlState['isDataLoaded']): void
  setIsUiLoaded(isUiLoaded: OptionsCtrlState['isUiLoaded']): void
  setWalletConnectVersion(walletConnectVersion: OptionsCtrlState['walletConnectVersion']): void
}

// -- controller --------------------------------------------------- //
export const OptionsCtrl: OptionsCtrl = {
  state,

  subscribe(callback: (newState: OptionsCtrlState) => void) {
    return valtioSub(state, () => callback(state))
  },

  setChains(chains?: OptionsCtrlState['chains']) {
    state.chains = chains
  },

  setStandaloneChains(standaloneChains: OptionsCtrlState['standaloneChains']) {
    state.standaloneChains = standaloneChains
  },

  setStandaloneUri(standaloneUri: OptionsCtrlState['standaloneUri']) {
    state.standaloneUri = standaloneUri
  },

  getSelectedChain() {
    const selectedChain = ClientCtrl.client().getNetwork().chain
    if (selectedChain) {
      state.selectedChain = selectedChain
    }

    return state.selectedChain
  },

  setSelectedChain(selectedChain: OptionsCtrlState['selectedChain']) {
    state.selectedChain = selectedChain
  },

  setIsStandalone(isStandalone: OptionsCtrlState['isStandalone']) {
    state.isStandalone = isStandalone
  },

  setIsCustomDesktop(isCustomDesktop: OptionsCtrlState['isCustomDesktop']) {
    state.isCustomDesktop = isCustomDesktop
  },

  setIsCustomMobile(isCustomMobile: OptionsCtrlState['isCustomMobile']) {
    state.isCustomMobile = isCustomMobile
  },

  setIsDataLoaded(isDataLoaded: OptionsCtrlState['isDataLoaded']) {
    state.isDataLoaded = isDataLoaded
  },

  setIsUiLoaded(isUiLoaded: OptionsCtrlState['isUiLoaded']) {
    state.isUiLoaded = isUiLoaded
  },

  setWalletConnectVersion(walletConnectVersion: OptionsCtrlState['walletConnectVersion']) {
    state.walletConnectVersion = walletConnectVersion
  }
}
