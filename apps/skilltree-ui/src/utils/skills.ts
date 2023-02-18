import { SkillMetadata } from 'components/Skills/types'
import { BigNumber } from 'ethers'
import { UserBalances } from 'state/User'

export const enum SkillLockStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  OWNED = 'OWNED'
}

export function getLockStatus(skill: SkillMetadata | undefined, balances?: UserBalances): SkillLockStatus {
  if (!skill) return SkillLockStatus.LOCKED

  const ownsSkill = !BigNumber.from(balances?.[skill.properties.id] || 0).isZero()
  if (ownsSkill) return SkillLockStatus.OWNED

  const deps = skill.properties.dependencies

  let hasDeps = true
  console.warn(skill.name, ' requires skills', deps.join(' '), 'to unlock. Checking...')
  for (let i = 0; i < deps.length; i++) {
    if (!balances || !balances[deps[i]] || BigNumber.from(balances[deps[i]]).isZero()) {
      console.warn('You are missing skillId:', deps[i], '// Skill LOCKED.')
      hasDeps = false
      break
    }

    console.warn('Has skillId', deps[i], '? YES')
  }
  if (hasDeps) {
    console.warn('ALL skills owned! Unlocking skill...')
    return SkillLockStatus.UNLOCKED
  } else {
    return SkillLockStatus.LOCKED
  }
}
