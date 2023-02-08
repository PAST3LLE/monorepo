import { useSkillSizeWriteAtom } from '..'
import { useEffect } from 'react'
import { useGetWindowSize } from 'state/WindowSize'

export function SkillSquareSizeUpdater() {
  const [{ width, height }] = useGetWindowSize()
  const [, setSkillSize] = useSkillSizeWriteAtom()

  useEffect(() => {
    const skillSquare = document.getElementById('SKILLPOINT_SQUARE')
    setSkillSize({ width: skillSquare?.clientWidth || 0, height: skillSquare?.clientHeight || 0 })
  }, [width, height, setSkillSize])

  return null
}
