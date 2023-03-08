import { ContractAddressMap, ForgeWeb3ProviderProps, MetadataUriMap } from '@past3lle/forge-web3'

import { SkilltreeThemeByModes } from '../theme/types'

export interface AppConfig {
  name: string
  theme: SkilltreeThemeByModes
  provider: ForgeWeb3ProviderProps['walletConnect']
  contractAddresses: ContractAddressMap
  metadataUris: MetadataUriMap
}
