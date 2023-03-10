import { useSkillForgeWindowSizeAtom } from '@past3lle/skillforge-web3'
import { useEffect } from 'react'

import { useSkillSizeWriteAtom } from '..'
import { SKILLPOINT_SIZES } from '../../../constants/skills'

export function SkillSquareSizeUpdater() {
  const [{ width, height }] = useSkillForgeWindowSizeAtom()
  const [, setSkillSize] = useSkillSizeWriteAtom()

  useEffect(() => {
    // const skillSquare = document.getElementById('SKILLPOINT_SQUARE')
    const width = window.innerHeight / Number(SKILLPOINT_SIZES.width.replace('vh', ''))
    // square so use widthx2
    setSkillSize({ width: width || 0, height: width || 0 })
  }, [width, height, setSkillSize])

  return null
}
