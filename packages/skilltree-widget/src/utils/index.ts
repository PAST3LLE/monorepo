import { GATEWAY_URI } from '../constants/ipfs'
import { SKILL_ID_BASE } from '../constants/skills'
import { baseTheme } from '../theme/base'
import { SkillMetadata, SkillRarity } from '../types'

export const getHash = (uri: string) => (uri.startsWith('ipfs://') ? uri.substring(7) : uri)
export function ipfsToImageUri(uriHash: string) {
  const skillUriHash = getHash(uriHash)

  return `${GATEWAY_URI}/${skillUriHash}`
}
export async function getTokenUri(imageUri: SkillMetadata['image']) {
  const skillMetaData: SkillMetadata = await (await fetch(imageUri)).json()
  return ipfsToImageUri(skillMetaData.image)
}

export function getRarityColours(rarity?: SkillRarity) {
  if (!rarity) return baseTheme.rarity.common

  return baseTheme.rarity[rarity]
}

export const getSkillId = (idx: number) => (idx + 1) * SKILL_ID_BASE
export function get64PaddedSkillId(i: number) {
  return getSkillId(i).toString().padStart(64, '0')
}
