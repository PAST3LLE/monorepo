import { PstlHooksProviderOptions } from '@past3lle/hooks'
import { PstlWeb3ModalProps } from '@past3lle/web3-modal'

import { MetadataFetchOptions } from '../state/Metadata/updaters/MetadataUpdater'
import { SkillForgeContractAddressMap } from './addresses'
import { SkillForgeMetadataUriMap } from './metadata'

export interface SkillForgeW3AppConfigSkillOptions {
  idBase?: number
  metadataFetchOptions?: MetadataFetchOptions
}
export interface SkillForgeW3AppConfig {
  name: string
  web3: Omit<PstlWeb3ModalProps, 'appName'> & {
    standalone?: boolean
  }
  contractAddresses: SkillForgeContractAddressMap
  metadataUris: SkillForgeMetadataUriMap
  skillOptions?: SkillForgeW3AppConfigSkillOptions
  hooksProviderOptions?: PstlHooksProviderOptions
}
