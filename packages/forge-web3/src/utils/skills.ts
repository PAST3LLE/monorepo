import { devWarn } from '@past3lle/utils'
import { DefaultTheme } from 'styled-components'
import { Address } from 'wagmi'

import { ForgeBalances } from '../state/Balances'
import { SkillDependencyObject, SkillId, SkillMetadata, SkillRarity } from '../types'
import { ipfsToImageUri } from './ipfs'

export enum SkillLockStatus {
  LOCKED = 'LOCKED',
  UNLOCKABLE_IN_STORE = 'UNLOCKABLE IN STORE',
  UNLOCKABLE_IN_TRADE = 'UNLOCKABLE IN TRADE',
  OWNED = 'OWNED'
}

export function getBigIntBalanceFromSkill(skill: SkillMetadata | null, balances?: ForgeBalances[number]) {
  if (!skill?.properties?.id || !balances?.[skill?.properties?.id]) return BigInt(0)
  return BigInt(balances[skill.properties.id] || 0)
}

export function getLockStatus(
  skill: SkillMetadata | undefined,
  balances?: ForgeBalances[number],
  address?: Address
): SkillLockStatus {
  const deps = skill?.properties.dependencies || []
  const hasDeps = deps.length > 0

  if (!skill || (hasDeps && !address) || (hasDeps && !balances)) return SkillLockStatus.LOCKED
  if (getBigIntBalanceFromSkill(skill, balances) > 0) return SkillLockStatus.OWNED

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
export function getRarityColours<T extends DefaultTheme & { rarity: { [key in SkillRarity]: any } }>(
  theme: T,
  rarity?: SkillRarity
) {
  if (!rarity) return theme.rarity.common
  return theme.rarity[rarity]
}

export function splitSkillAddressId(skill?: SkillMetadata | null): [Address, string] | undefined {
  return skill?.properties?.id?.split('-') as [Address, string] | undefined
}

export function skillToSkillId(skill?: SkillMetadata | null): SkillId | undefined {
  const splitId = splitSkillAddressId(skill)
  if (!splitId) return undefined

  return `${splitId[0]}-${splitId[1]}`
}

export function skillDepToSkillId(skill?: SkillDependencyObject): SkillId | undefined {
  if (!skill) return undefined

  return `${skill.token}-${skill.id}`
}

export function formatSkillMetadataToArgs(skill: SkillMetadata | null): SkillDependencyObject | undefined {
  const splitInfo = splitSkillAddressId(skill)

  if (!splitInfo) return undefined
  return { token: splitInfo[0], id: BigInt(splitInfo[1]) }
}

export function skillToDependencySet(skill?: SkillMetadata | null): Set<Address> | undefined {
  if (!skill?.properties?.dependencies || !Array.isArray(skill?.properties?.dependencies)) return undefined
  return new Set(skill.properties.dependencies.map((d) => d.token))
}

export function dedupeList<A extends any[]>(list: A): A {
  const listAsSet = new Set(list)
  return [...listAsSet] as A
}
