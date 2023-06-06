import { PstlHooksProviderOptions } from '@past3lle/hooks'
import { PstlWeb3ModalProps } from '@past3lle/web3-modal'

import { MetadataFetchOptions as ForgeMetadataFetchOptions } from '../state/Metadata/updaters/MetadataUpdater'
import { ForgeContractAddressMap } from './addresses'
import { SupportedForgeChains } from './chains'
import { ForgeMetadataUriMap } from './metadata'

export { type ForgeMetadataFetchOptions }
export interface ForgeW3AppConfigSkillOptions {
  metadataFetchOptions?: ForgeMetadataFetchOptions
}

export type Web3ModalConfigWeb3Props = Omit<PstlWeb3ModalProps<SupportedForgeChains>, 'appName'> & {
  standalone?: boolean
}
export interface ForgeW3AppConfig {
  name: string
  web3: Web3ModalConfigWeb3Props
  contractAddresses: ForgeContractAddressMap
  metadataUris: ForgeMetadataUriMap
  skillOptions?: ForgeW3AppConfigSkillOptions
  hooksProviderOptions?: PstlHooksProviderOptions
}
