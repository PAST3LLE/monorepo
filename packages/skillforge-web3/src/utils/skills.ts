import { BigNumber } from '@ethersproject/bignumber'
import { devWarn } from '@past3lle/utils'

import { SkillForgeBalances } from '../state/Balances'
import { SkillId, SkillMetadata, SkillRarity } from '../types'
import { ipfsToImageUri } from './ipfs'

export enum SkillLockStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKABLE',
  OWNED = 'OWNED'
}

export function getLockStatus(skill: SkillMetadata | undefined, balances?: SkillForgeBalances): SkillLockStatus {
  if (!skill) return SkillLockStatus.LOCKED

  const ownsSkill = !BigNumber.from(balances?.[skill.properties.id] || 0).isZero()
  if (ownsSkill) return SkillLockStatus.OWNED

  const deps = skill.properties.dependencies

  let hasDeps = true
  devWarn(skill.name, ' requires skills', deps.join(' '), 'to unlock. Checking...')
  for (let i = 0; i < deps.length; i++) {
    const tokenId: SkillId = `${deps[i].token}-${deps[i].id.toString()}`
    if (!balances || !balances[tokenId] || BigNumber.from(balances[tokenId]).isZero()) {
      devWarn('You are missing skillId:', deps[i], '// Skill LOCKED.')
      hasDeps = false
      break
    }

    devWarn('Has skillId', deps[i], '? YES')
  }
  if (hasDeps) {
    devWarn('ALL skills owned! Unlocking skill...')
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

export const getSkillId = (idx: number, idBase = 1) => (idx + 1) * idBase
export function get64PaddedSkillId(i: number, idBase = 1) {
  return getSkillId(i, idBase).toString().padStart(64, '0')
}
