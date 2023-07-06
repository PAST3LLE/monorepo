import { useForgeWindowSizeAtom } from '@past3lle/forge-web3'
import { useEffect } from 'react'

import { useForgeSizeWriteAtom } from '..'
import { CANVAS_CONTAINER_ID, SKILLPOINT_SIZES } from '../../../constants/skills'

export function SkillSquareSizeUpdater() {
  const [{ width, height }] = useForgeWindowSizeAtom()
  const [, setSkillSize] = useForgeSizeWriteAtom()

  useEffect(() => {
    if (typeof document === undefined) return
    const canvas = document.getElementById(CANVAS_CONTAINER_ID)

    if (canvas) {
      const width = canvas.clientHeight / Number(SKILLPOINT_SIZES.width.replace('vh', ''))
      setSkillSize({ width: width || 0, height: width || 0 })
    }
  }, [width, height, setSkillSize])

  return null
}
