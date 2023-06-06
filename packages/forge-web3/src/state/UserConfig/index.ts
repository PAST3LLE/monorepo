import { Address } from '@past3lle/types'
import { ChainsPartialReadonly } from '@past3lle/web3-modal'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Chain } from 'wagmi'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'
import { ForgeContractAddressMap, ForgeMetadataUriMap } from '../../types'
import { CustomIpfsGatewayConfig } from '../../utils'

export interface UserConfigState<ID extends number> {
  chains: ChainsPartialReadonly<ID>
  user: {
    account: Address | undefined
    chainId: number | undefined
  }
  ipfs: {
    gatewayUris: CustomIpfsGatewayConfig[]
    gatewayApiUris: CustomIpfsGatewayConfig[]
  }
  metadataUriMap: Partial<ForgeMetadataUriMap>
  contractAddressMap: Partial<ForgeContractAddressMap>
}
export const userConfigAtom = atomWithStorage<UserConfigState<number>>(STATE_STORAGE_KEYS.FORGE_USER_CONFIG_STATE, {
  chains: [],
  user: {
    account: undefined,
    chainId: undefined
  },
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
export const ipfsGatewaysSetter = atom<null, UserConfigState<number>['ipfs']>(null, (get, set, update) => {
  const state = get(userConfigAtom)
  return set(userConfigAtom, {
    ...state,
    ipfs: update
  })
})

export const mmetadataUrisReadAtom = atom<UserConfigState<number>['metadataUriMap']>(
  (get) => get(userConfigAtom).metadataUriMap
)
export const metadataUriMapAtom = atom<
  UserConfigState<number>['metadataUriMap'],
  UserConfigState<number>['metadataUriMap']
>(
  (get) => get(userConfigAtom).metadataUriMap,
  (get, set, update) => {
    const state = get(userConfigAtom)
    return set(userConfigAtom, {
      ...state,
      metadataUriMap: update
    })
  }
)

export const contractAddressesReadAtom = atom<UserConfigState<number>['contractAddressMap']>(
  (get) => get(userConfigAtom).contractAddressMap
)
export const contractAddressMapAtom = atom<
  UserConfigState<number>['contractAddressMap'],
  UserConfigState<number>['contractAddressMap']
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

export const useForgeSetIpfsAtom = () => useAtom(ipfsGatewaysSetter)
export const useForgeGetIpfsAtom = () => useAtom(ipfsGatewaysGetter)

export const userChainsGetter = atom((get) => get(userConfigAtom).chains)

export const useForgeGetUserConfigChainsAtom = () => useAtom(userChainsGetter)
export const useForgeSetUserConfigChainsAtom = () => useAtom(supportedChainsSetter)

export const useForgeUserConfigAtom = () => useAtom(userConfigAtom)

export const useForgeMetadataUriMapReadAtom = () => useAtom(mmetadataUrisReadAtom)
export const useForgeMetadataUriMapAtom = () => useAtom(metadataUriMapAtom)

export const useForgeContractAddressMapReadAtom = () => useAtom(contractAddressesReadAtom)
export const useForgeContractAddressMapAtom = () => useAtom(contractAddressMapAtom)
