import { Past3lleHooksProviderOptions } from '@past3lle/hooks'
import { EthereumClient } from '@web3modal/ethereum'

import { SkillForgeW3ProviderProps } from '../providers'
import { SkillForgeW3WagmiClient } from '../providers/utils'
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
    walletconnectProvider: SkillForgeW3ProviderProps['walletConnect']
    wagmiClient?: SkillForgeW3WagmiClient
    ethereumClient?: EthereumClient
  }
  contractAddresses: SkillForgeContractAddressMap
  metadataUris: SkillForgeMetadataUriMap
  skillOptions?: SkillForgeW3AppConfigSkillOptions
  hooksProviderOptions?: Past3lleHooksProviderOptions
}
