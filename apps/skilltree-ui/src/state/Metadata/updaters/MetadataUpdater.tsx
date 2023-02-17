import { useMetadataWriteAtom, useMetadataMapWriteAtom, MetadataState } from '..'
import { useMetadata } from 'components/Skills/hooks'
import { SkillMetadata } from 'components/Skills/types'
import { useEffect } from 'react'

export function MetadataUpdater() {
  const metadataInfo2 = useMetadata(2)
  const metadataInfo3 = useMetadata(3)
  const [, setMetadataState] = useMetadataWriteAtom()
  const [, setMetadataMapState] = useMetadataMapWriteAtom()

  useEffect(() => {
    // @ts-ignore
    const metadata: SkillMetadata[][] = [metadataInfo2.realMetadata, metadataInfo3.realMetadata].filter(Boolean)
    if (!metadata.length) return

    const metadataMap = metadata
      .flatMap((item) => item)
      .reduce((acc, next) => {
        const id = next.properties.id
        acc[id] = next
        return acc
      }, {} as MetadataState['metadataMap'])

    setMetadataState(metadata)
    setMetadataMapState(metadataMap)
  }, [metadataInfo2.realMetadata, metadataInfo3.realMetadata, setMetadataMapState, setMetadataState])

  return null
}
