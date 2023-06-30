import { devWarn } from '@past3lle/utils'
import { Address } from 'wagmi'

import { ForgeBalances } from '../state/Balances'
import { SkillId, SkillMetadata, SkillRarity } from '../types'
import { ipfsToImageUri } from './ipfs'

export enum SkillLockStatus {
  LOCKED = 'LOCKED',
  UNLOCKABLE_IN_STORE = 'UNLOCKABLE IN STORE',
  UNLOCKABLE_IN_TRADE = 'UNLOCKABLE IN TRADE',
  OWNED = 'OWNED'
}

export function getLockStatus(
  skill: SkillMetadata | undefined,
  balances?: ForgeBalances[number],
  address?: Address
): SkillLockStatus {
  const deps = skill?.properties.dependencies || []
  const hasDeps = deps.length > 0

  if (!skill || (hasDeps && !address) || (hasDeps && !balances)) return SkillLockStatus.LOCKED
  if (BigInt(balances?.[skill.properties.id] || 0) > 0) return SkillLockStatus.OWNED

  devWarn(skill.name, ' requires skills', deps.join(' '), 'to unlock. Checking...')
  const missingDeps = deps.some((dep) => {
    const depId: SkillId = `${dep.token}-${dep.id.toString()}`
    if (!balances?.[depId] || BigInt(balances[depId]) === BigInt(0)) {
      devWarn('User missing skills with dependency ID:', dep, '. Skill LOCKED.')
      return true
    }
    return false
  })

  if (!missingDeps) {
    if (hasDeps) {
      devWarn('All skill depdendencies owned! Unlockable by trading in required skills!')
      return SkillLockStatus.UNLOCKABLE_IN_TRADE
    } else {
      devWarn('No dependencies required. Unlockable by purchasing in store!')
      return SkillLockStatus.UNLOCKABLE_IN_STORE
    }
  } else {
    return SkillLockStatus.LOCKED
  }
}

export async function getTokenUri(imageUri: SkillMetadata['image'], ...gatewayUris: string[]) {
  const skillMetaData: SkillMetadata = await (await fetch(imageUri)).json()
  return ipfsToImageUri(skillMetaData.image, ...gatewayUris)
}

// TODO: fix this with base "forge" type e.g extends ThemeWithRarity
export function getRarityColours<T extends { rarity: { [key in SkillRarity]: any } }>(theme: T, rarity?: SkillRarity) {
  if (!rarity) return theme.rarity.common

  return theme.rarity[rarity]
}
