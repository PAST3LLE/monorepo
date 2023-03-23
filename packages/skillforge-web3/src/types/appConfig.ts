import { Past3lleHooksProviderOptions } from '@past3lle/hooks'
import { EthereumClient } from '@web3modal/ethereum'

import { SkillForgeW3ProviderProps } from '../providers'
import { SkillForgeW3WagmiClientOptions } from '../providers/utils'
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
    web3Modal: SkillForgeW3ProviderProps['web3Modal']
    wagmiClient?: SkillForgeW3WagmiClientOptions
    ethereumClient?: EthereumClient
  }
  contractAddresses: SkillForgeContractAddressMap
  metadataUris: SkillForgeMetadataUriMap
  skillOptions?: SkillForgeW3AppConfigSkillOptions
  hooksProviderOptions?: Past3lleHooksProviderOptions
}
