import { EthereumClient } from '@web3modal/ethereum'

import { SkillForgeW3ProviderProps } from '../providers'
import { SkillForgeW3WagmiClient } from '../providers/utils'
import { SkillForgeContractAddressMap } from './addresses'
import { SkillForgeMetadataUriMap } from './metadata'

export interface SkillForgeW3AppConfigSkillOptions {
  idBase?: number
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
}
