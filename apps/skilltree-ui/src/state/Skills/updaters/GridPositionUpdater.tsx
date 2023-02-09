import { SkillVectorsMap, useSkillsAtom } from '..'
import { calculateGridPoints } from 'components/Canvas/api/hooks'
import { useMetadata } from 'components/Skills/hooks'
import { useEffect } from 'react'
import { useGetWindowSize } from 'state/WindowSize'

export function GridPositionUpdater() {
  const metadata = useMetadata()
  const { skillsMetadata = [] } = metadata

  const [{ active, vectors }, setSkillState] = useSkillsAtom()
  const [windowSizeState] = useGetWindowSize()

  useEffect(
    () => {
      const ref = document.getElementById('CANVAS-CONTAINER')
      setSkillState((state) => ({
        ...state,
        vectors: ref
          ? calculateGridPoints(skillsMetadata, {
              clientWidth: document.body.clientWidth,
              clientHeight: ref.clientHeight
            })
          : []
      }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [skillsMetadata, windowSizeState.height, windowSizeState.width, active]
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
