import { WindowSizeProviderOptions } from '@past3lle/hooks'
import { PstlWeb3ModalProps } from '@past3lle/web3-modal'

import { UserConfigState } from '../state'
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
  /**
   * @name boardOptions - properties:
   * @param minimumColumns default: 3
   * @param minimumBoardHeight default: 500
   * @param minimumBoardWidth default: 580
   * @param emptyCollectionRowAmount default: 6
   */
  boardOptions?: Partial<UserConfigState['board']>
  contactInfo: UserConfigState['user']['contactInfo']
  contentUrls?: UserConfigState['contentUrls']
  web3: Web3ModalConfigWeb3Props
  /**
   * @name contractAddresses - mapping of network IDs to deployed CollectionsManager.sol addresses
   * @example
   * contractAddresses: {
   *  [SupportedForgeChains.GOERLI]: {
   *    CollectionsManager: "0x123123123123123123_GoerliAddress"
   *  },
   * [SupportedForgeChains.POLYGON]: {
   *    CollectionsManager: "0x123123123123123123_PolyAddress"
   *  },
   *  [SupportedForgeChains.POLYGON]: "https://some.polygon.metadata.uri"
   * }
   */
  contractAddresses: ForgeContractAddressMap
  /**
   * @name metadataUris - mapping of network IDs to CollectionsManager.sol metadata
   * @example
   * metadataUris: {
   *  [SupportedForgeChains.GOERLI]: "https://some.metadata.uri",
   *  [SupportedForgeChains.POLYGON]: "https://some.polygon.metadata.uri"
   * }
   */
  metadataUris: ForgeMetadataUriMap
  skillOptions?: ForgeW3AppConfigSkillOptions
  hooksProviderOptions?: WindowSizeProviderOptions
}
