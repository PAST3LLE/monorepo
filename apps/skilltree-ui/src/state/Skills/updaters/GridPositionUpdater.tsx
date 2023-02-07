import { SkillVectorsMap, useSkillsAtom } from '..'
import { calculateGridPoints } from 'components/Canvas/api/hooks'
import { useMetadata } from 'components/Skills/hooks'
import { useEffect } from 'react'
import { useGetWindowSize } from 'state/WindowSize'

export function GridPositionUpdater() {
  const metadata = useMetadata()
  const { skillsMetadata = [] } = metadata
  const [{ vectors }, setSkillState] = useSkillsAtom()
  // Skill ID in contract corresponds to position in grid, e.g Collection 2 has 2 skills with IDs 1000 and 4000, respectively
  // Meaning they will get grid positions skill2_1 and skill2_4, respectively
  const [windowSizeState] = useGetWindowSize()

  useEffect(
    () => {
      const ref = document.getElementById('CANVAS-CONTAINER')
      setSkillState((state) => ({ ...state, vectors: ref ? calculateGridPoints(skillsMetadata, ref) : [] }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [skillsMetadata, windowSizeState.height, windowSizeState.width]
  )

  useEffect(() => {
    if (vectors.length > 0) {
      const vectorsMap = vectors.reduce((acc, next) => {
        const id = next.skill?.properties.id
        if (id) {
          acc[id] = next
        }
        return acc
      }, {} as SkillVectorsMap)
      setSkillState((state) => ({ ...state, vectorsMap }))
    }
  }, [setSkillState, vectors])

  return null
}
