import { devWarn } from '@past3lle/utils'
import { BigNumber } from '@ethersproject/bignumber'

import { UserBalances } from '../state/User'
import { SkillMetadata } from '../types'

export const enum SkillLockStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKABLE',
  OWNED = 'OWNED'
}

export function getLockStatus(skill: SkillMetadata | undefined, balances?: UserBalances): SkillLockStatus {
  if (!skill) return SkillLockStatus.LOCKED

  const ownsSkill = !BigNumber.from(balances?.[skill.properties.id] || 0).isZero()
  if (ownsSkill) return SkillLockStatus.OWNED

  const deps = skill.properties.dependencies

  let hasDeps = true
  devWarn(skill.name, ' requires skills', deps.join(' '), 'to unlock. Checking...')
  for (let i = 0; i < deps.length; i++) {
    if (!balances || !balances[deps[i]] || BigNumber.from(balances[deps[i]]).isZero()) {
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
