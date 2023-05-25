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
  balances?: SkillForgeBalances,
  address?: Address
): SkillLockStatus {
  if (!skill || !balances || !address) return SkillLockStatus.LOCKED

  const skillBalance = balances?.[skill.properties.id]
  if (!!skillBalance && BigNumber.from(skillBalance).gt(0)) {
    return SkillLockStatus.OWNED
  }

  const deps = skill.properties.dependencies

  let hasDeps = true
  devWarn(skill.name, ' requires skills', deps.join(' '), 'to unlock. Checking...')
  for (let i = 0; i < deps.length; i++) {
    const depId: SkillId = `${deps[i].token}-${deps[i].id.toString()}`
    if (!balances[depId] || BigNumber.from(balances[depId]).isZero()) {
      devWarn('You are missing dependency with ID:', deps[i], '. Skill LOCKED.')
      hasDeps = false
      break
    }

    devWarn('Success! User owns dependency with ID:', deps[i])
  }
  if (hasDeps) {
    devWarn('ALL depdendencies owned! Skill unlockable.')
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
