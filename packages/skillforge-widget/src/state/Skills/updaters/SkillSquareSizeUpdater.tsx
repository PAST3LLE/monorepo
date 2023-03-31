import { useSkillForgeWindowSizeAtom } from '@past3lle/skillforge-web3'
import { useEffect } from 'react'

import { useSkillSizeWriteAtom } from '..'
import { CANVAS_CONTAINER_ID, SKILLPOINT_SIZES } from '../../../constants/skills'

export function SkillSquareSizeUpdater() {
  const [{ width, height }] = useSkillForgeWindowSizeAtom()
  const [, setSkillSize] = useSkillSizeWriteAtom()

  useEffect(() => {
    const canvas = document.getElementById(CANVAS_CONTAINER_ID)

    if (canvas) {
      const width = canvas.clientHeight / Number(SKILLPOINT_SIZES.width.replace('vh', ''))
      setSkillSize({ width: width || 0, height: width || 0 })
    }
  }, [width, height, setSkillSize])

  return null
}
