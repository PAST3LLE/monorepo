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
    default:
      return ''
  }
}

// TODO: this fn should be local to the project using SkillForge Widget
const STORE_URL = process.env.NODE_ENV === 'production' ? SHOP_URL : SHOP_URL || 'http://localhost:8080'
const REFERALL_PARAM = 'referral=FORGE'
export function getSkillShopUri(activeSkill: SkillMetadata): { url: string; type: 'PRODUCT' | 'COLLECTION' } | null {
  const isCollectionSkill =
    !!activeSkill?.properties?.isCollection || activeSkill?.properties?.id?.split('-')[1] === '0000'
  // skill has incorrect metadata, return null
  if (!isCollectionSkill && !activeSkill?.properties?.shopifyId) return null
  // skill is a collection, return collection view page
  else if (isCollectionSkill)
    return { url: `${STORE_URL}?${REFERALL_PARAM}&id=${activeSkill.properties.shopifyId}`, type: 'COLLECTION' }
  // skill is a collection skillpoint, return skill product view page
  return {
    url: `${STORE_URL}/skills/${(
      activeSkill?.attributes?.handle || activeSkill.name
    ).toLowerCase()}?${REFERALL_PARAM}&id=${activeSkill.properties.shopifyId}`,
    type: 'PRODUCT'
  }
}
