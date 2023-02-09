import { useSkillsAtom } from '..'
import { toggleSelectedSkill } from 'components/Canvas/api/hooks'
import { useEffect } from 'react'

export function ActiveSkillUpdater() {
  const [state] = useSkillsAtom()

  useEffect(() => {
    toggleSelectedSkill(state)

    if (state.active) {
      const { vector } = state.vectorsMap[state.active]
      vector && window.scroll(vector.X1, vector.Y1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.active])

  return null
}
