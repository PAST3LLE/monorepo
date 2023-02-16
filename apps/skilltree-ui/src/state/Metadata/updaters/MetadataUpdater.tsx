import { useMetadataWriteAtom } from '..'
import { useMetadata } from 'components/Skills/hooks'
import { SkillMetadata } from 'components/Skills/types'
import { useEffect } from 'react'

export function MetadataUpdater() {
  const metadataInfo2 = useMetadata(2)
  const metadataInfo3 = useMetadata(3)
  const [, setMetadataState] = useMetadataWriteAtom()

  useEffect(() => {
    // @ts-ignore
    const metadata: SkillMetadata[][] = [metadataInfo2.realMetadata, metadataInfo3.realMetadata].filter(Boolean)
    if (!metadata.length) return
    setMetadataState(metadata)
  }, [metadataInfo2.realMetadata, metadataInfo3.realMetadata, setMetadataState])

  return null
}
