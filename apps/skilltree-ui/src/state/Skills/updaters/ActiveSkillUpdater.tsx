import { useSkillsAtom } from '..'
import { toggleSelectedSkill } from 'components/Canvas/api/hooks'
import { useEffect } from 'react'

export function ActiveSkillUpdater() {
  const [state] = useSkillsAtom()

  useEffect(() => {
    toggleSelectedSkill(state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.active])

  return null
}
