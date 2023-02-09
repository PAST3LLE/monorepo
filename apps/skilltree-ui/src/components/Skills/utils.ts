import { Rarity, SkillMetadata } from './types'
import { GATEWAY_URI } from 'constants/ipfs'
import { CUSTOM_THEME } from 'theme/customTheme'

export const getHash = (uri: string) => (uri.startsWith('ipfs://') ? uri.substring(7) : uri)

export async function getTokenUri(imageUri: SkillMetadata['image']) {
  const skillMetaData: SkillMetadata = await (await fetch(imageUri)).json()
  const skillUriHash = getHash(skillMetaData.image)

  return `${GATEWAY_URI}/${skillUriHash}`
}

export function getRarityColours(rarity?: Rarity) {
  if (!rarity) return CUSTOM_THEME.rarity.common

  return CUSTOM_THEME.rarity[rarity]
}
