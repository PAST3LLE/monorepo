import { atom, useAtom } from 'jotai'
import { Chain } from 'wagmi'

import { CustomIpfsGatewayConfig } from '../../utils'

interface UserConfigState {
  chains: Chain[]
  ipfs: {
    gatewayUris: CustomIpfsGatewayConfig[]
    gatewayApiUris: CustomIpfsGatewayConfig[]
  }
}
export const userConfigAtom = atom<UserConfigState>({
  chains: [],
  ipfs: {
    gatewayUris: [],
    gatewayApiUris: []
  }
})
userConfigAtom.debugLabel = 'USER CONFIG ATOM'

export const supportedChainsSetter = atom<null, Chain[]>(null, (get, set, update) => {
  const state = get(userConfigAtom)
  return set(userConfigAtom, { ...state, chains: update })
})
export const ipfsGatewaysSetter = atom<null, UserConfigState['ipfs']>(null, (get, set, update) => {
  const state = get(userConfigAtom)
  return set(userConfigAtom, {
    ...state,
    ipfs: update
  })
})
export const ipfsGatewaysGetter = atom((get) => get(userConfigAtom).ipfs)

export const useSkillForgeSetIpfsAtom = () => useAtom(ipfsGatewaysSetter)
export const useSkillForgeGetIpfsAtom = () => useAtom(ipfsGatewaysGetter)

export const supportedChainsGetter = atom((get) => get(userConfigAtom).chains)

export const useSkillForgeGetSupportedChainsAtom = () => useAtom(supportedChainsGetter)
export const useSkillForgeSetSupportedChainsAtom = () => useAtom(supportedChainsSetter)

export const useSkillForgeUserConfigAtom = () => useAtom(userConfigAtom)
