import { PstlHooksProviderOptions } from '@past3lle/hooks'
import { PstlW3ProviderProps } from '@past3lle/web3-modal'

import { MetadataFetchOptions } from '../state/Metadata/updaters/MetadataUpdater'
import { SkillForgeContractAddressMap } from './addresses'
import { SkillForgeMetadataUriMap } from './metadata'

export interface SkillForgeW3AppConfigSkillOptions {
  idBase?: number
  metadataFetchOptions?: MetadataFetchOptions
}
export interface SkillForgeW3AppConfig {
  name: string
  web3: {
    standalone?: boolean
    web3Modal: PstlW3ProviderProps['web3Modal']
    web3Auth: PstlW3ProviderProps['web3Auth']
    wagmiClient?: PstlW3ProviderProps['wagmiClient']
    ethereumClient?: PstlW3ProviderProps['ethereumClient']
  }
  contractAddresses: SkillForgeContractAddressMap
  metadataUris: SkillForgeMetadataUriMap
  skillOptions?: SkillForgeW3AppConfigSkillOptions
  hooksProviderOptions?: PstlHooksProviderOptions
}
