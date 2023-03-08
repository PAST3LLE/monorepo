import { ipfsToImageUri } from '@past3lle/forge-web3'

import { SKILL_ID_BASE } from '../constants/skills'
import { baseTheme } from '../theme/base'
import { SkillMetadata, SkillRarity } from '../types'

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
