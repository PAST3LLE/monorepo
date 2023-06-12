import { SkillMetadata, SupportedForgeChains } from '@past3lle/forge-web3'

type MetadataExplorerUris = 'opensea'

export function buildSkillMetadataExplorerUri(
  uri: MetadataExplorerUris,
  skill: SkillMetadata,
  chainId: SupportedForgeChains
) {
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
