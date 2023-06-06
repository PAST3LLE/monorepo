import { BigNumber } from '@ethersproject/bignumber'
import { devWarn } from '@past3lle/utils'
import { Address } from 'wagmi'

import { SkillForgeBalances } from '../state/Balances'
import { SkillId, SkillMetadata, SkillRarity } from '../types'
import { ipfsToImageUri } from './ipfs'

export enum SkillLockStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKABLE',
  OWNED = 'OWNED'
}

export function getLockStatus(
  skill: SkillMetadata | undefined,
  balances?: SkillForgeBalances[number],
  address?: Address
): SkillLockStatus {
  const deps = skill?.properties.dependencies || []

  if (!skill || (!!deps?.length && !address) || (!!deps?.length && !balances)) return SkillLockStatus.LOCKED
  if (BigNumber.from(balances?.[skill.properties.id] || 0).gt(0)) return SkillLockStatus.OWNED

  devWarn(skill.name, ' requires skills', deps.join(' '), 'to unlock. Checking...')
  const missingDeps = deps.some((dep) => {
    const depId: SkillId = `${dep.token}-${dep.id.toString()}`
    if (!balances?.[depId] || BigNumber.from(balances[depId]).isZero()) {
      devWarn('User missing skills with dependency ID:', dep, '. Skill LOCKED.')
      return true
    }
    return false
  })

  if (!missingDeps) {
    devWarn('All skill depdendencies owned! Unlockable.')
    return SkillLockStatus.UNLOCKED
  } else {
    return SkillLockStatus.LOCKED
  }
}

export async function getTokenUri(imageUri: SkillMetadata['image']) {
  const skillMetaData: SkillMetadata = await (await fetch(imageUri)).json()
  return ipfsToImageUri(skillMetaData.image)
}

// TODO: fix this with base "forge" type e.g extends ThemeWithRarity
export function getRarityColours<T extends { rarity: { [key in SkillRarity]: any } }>(theme: T, rarity?: SkillRarity) {
  if (!rarity) return theme.rarity.common

  return theme.rarity[rarity]
}
