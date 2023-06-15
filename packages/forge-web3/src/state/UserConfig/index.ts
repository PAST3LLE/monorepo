import { Address } from '@past3lle/types'
import { ChainsPartialReadonly } from '@past3lle/web3-modal'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'
import { ForgeContractAddressMap, ForgeMetadataUriMap, SupportedForgeChains } from '../../types'
import { CustomIpfsGatewayConfig } from '../../utils'

export interface UserConfigState {
  chains: ChainsPartialReadonly<SupportedForgeChains>
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
export const userConfigAtom = atomWithStorage<UserConfigState>(STATE_STORAGE_KEYS.FORGE_USER_CONFIG_STATE, {
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

export const supportedChainsSetter = atom<null, ChainsPartialReadonly<SupportedForgeChains>>(
  null,
  (get, set, update) => {
    const state = get(userConfigAtom)
    return set(userConfigAtom, { ...state, chains: update })
  }
)
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
export const ipfsGatewaysUriGetter = atom((get) =>
  get(userConfigAtom).ipfs.gatewayUris.map((gatewayConfig) => gatewayConfig.gateway)
)

export const useForgeSetIpfsAtom = () => useAtom(ipfsGatewaysSetter)
export const useForgeGetIpfsAtom = () => useAtom(ipfsGatewaysGetter)
export const useForgeIpfsGatewayUrisAtom = () => useAtom(ipfsGatewaysUriGetter)

export const userChainsGetter = atom((get) => get(userConfigAtom).chains)

export const useForgeGetUserConfigChainsAtom = () => useAtom(userChainsGetter)
export const useForgeSetUserConfigChainsAtom = () => useAtom(supportedChainsSetter)

export const useForgeUserConfigAtom = () => useAtom(userConfigAtom)

export const useForgeMetadataUriMapReadAtom = () => useAtom(mmetadataUrisReadAtom)
export const useForgeMetadataUriMapAtom = () => useAtom(metadataUriMapAtom)

export const useForgeContractAddressMapReadAtom = () => useAtom(contractAddressesReadAtom)
export const useForgeContractAddressMapAtom = () => useAtom(contractAddressMapAtom)
