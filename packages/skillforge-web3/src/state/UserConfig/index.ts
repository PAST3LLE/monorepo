import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Chain } from 'wagmi'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'
import { SkillForgeContractAddressMap, SkillForgeMetadataUriMap } from '../../types'
import { CustomIpfsGatewayConfig } from '../../utils'

export interface UserConfigState {
  chains: Chain[]
  ipfs: {
    gatewayUris: CustomIpfsGatewayConfig[]
    gatewayApiUris: CustomIpfsGatewayConfig[]
  }
  metadataUriMap: Partial<SkillForgeMetadataUriMap>
  contractAddressMap: Partial<SkillForgeContractAddressMap>
}
export const userConfigAtom = atomWithStorage<UserConfigState>(STATE_STORAGE_KEYS.SKILLFORGE_USER_CONFIG_STATE, {
  chains: [],
  ipfs: {
    gatewayUris: [],
    gatewayApiUris: []
  },
  metadataUriMap: {},
  contractAddressMap: {}
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

export const mmetadataUrisReadAtom = atom<UserConfigState['metadataUriMap']>(
  (get) => get(userConfigAtom).metadataUriMap
)
export const metadataUriMapAtom = atom<UserConfigState['metadataUriMap'], UserConfigState['metadataUriMap']>(
  (get) => get(userConfigAtom).metadataUriMap,
  (get, set, update) => {
    const state = get(userConfigAtom)
    return set(userConfigAtom, {
      ...state,
      metadataUriMap: update
    })
  }
)

export const contractAddressesReadAtom = atom<UserConfigState['contractAddressMap']>(
  (get) => get(userConfigAtom).contractAddressMap
)
export const contractAddressMapAtom = atom<
  UserConfigState['contractAddressMap'],
  UserConfigState['contractAddressMap']
>(
  (get) => get(userConfigAtom).contractAddressMap,
  (get, set, update) => {
    const state = get(userConfigAtom)
    return set(userConfigAtom, {
      ...state,
      contractAddressMap: update
    })
  }
)

export const ipfsGatewaysGetter = atom((get) => get(userConfigAtom).ipfs)

export const useSkillForgeSetIpfsAtom = () => useAtom(ipfsGatewaysSetter)
export const useSkillForgeGetIpfsAtom = () => useAtom(ipfsGatewaysGetter)

export const supportedChainsGetter = atom((get) => get(userConfigAtom).chains)

export const useSkillForgeGetSupportedChainsAtom = () => useAtom(supportedChainsGetter)
export const useSkillForgeSetSupportedChainsAtom = () => useAtom(supportedChainsSetter)

export const useSkillForgeUserConfigAtom = () => useAtom(userConfigAtom)

export const useSkillForgeMetadataUriMapReadAtom = () => useAtom(mmetadataUrisReadAtom)
export const useSkillForgeMetadataUriMapAtom = () => useAtom(metadataUriMapAtom)

export const useSkillForgeContractAddressMapReadAtom = () => useAtom(contractAddressesReadAtom)
export const useSkillForgeContractAddressMapAtom = () => useAtom(contractAddressMapAtom)
