import { SkillMetadata, SupportedForgeChains } from '@past3lle/forge-web3'

import { SHOP_URL } from '../constants'

type MetadataExplorerUris = 'opensea'

export function buildSkillMetadataExplorerUri(
  uri: MetadataExplorerUris,
  skill: SkillMetadata | undefined,
  chainId: SupportedForgeChains | undefined
) {
  if (!skill || !chainId) return ''
  switch (uri) {
    case 'opensea': {
      const networkName = chainIdToOpenseaNetworkName(chainId)
      return `https://opensea.io/assets/${networkName}/${skill.properties.id.split('-')[0]}`
    }
    default:
      return ''
  }
}

function chainIdToOpenseaNetworkName(chainId: SupportedForgeChains) {
  switch (chainId) {
    case 5:
      return 'goerli'
    case 137:
      return 'matic'
    case 80001:
      return 'mumbai'
  }
}

// TODO: this fn should be local to the project using SkillForge Widget
const STORE_URL = process.env.NODE_ENV === 'production' ? SHOP_URL : 'http://localhost:8080'
export function getSkillShopUri(activeSkill: SkillMetadata) {
  return `${STORE_URL}/#/SKILLS/${(
    activeSkill?.attributes?.handle || activeSkill.name
  ).toLowerCase()}?referral=FORGE&id=${activeSkill.properties.shopifyId.replace('gid://shopify/Product/', '')}`
}
