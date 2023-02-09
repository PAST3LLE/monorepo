import { useSkillsAtom } from '..'
import { useMetadata } from 'components/Skills/hooks'
import { useEffect } from 'react'

export function SkillsMetadataUpdater() {
  const metadataInfo = useMetadata()
  const [, setSkillState] = useSkillsAtom()

  useEffect(() => {
    setSkillState((state) => ({
      ...state,
      metadata: metadataInfo.skillsMetadata
    }))
  }, [metadataInfo.skillsMetadata, setSkillState])

  return null
}
