import { EthereumClient } from '@web3modal/ethereum'

import { ForgeW3ProviderProps, ForgeW3WagmiClient } from '../providers'
import { ContractAddressMap } from './addresses'
import { MetadataUriMap } from './metadata'

export interface SkillOptions {
  idBase?: number
}
export interface ForgeW3AppConfig {
  name: string
  web3: {
    standalone?: boolean
    walletconnectProvider: ForgeW3ProviderProps['walletConnect']
    wagmiClient?: ForgeW3WagmiClient
    ethereumClient?: EthereumClient
  }
  contractAddresses: ContractAddressMap
  metadataUris: MetadataUriMap
  skillOptions?: SkillOptions
}
