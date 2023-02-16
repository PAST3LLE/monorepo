import { useMetadataWriteAtom } from '..'
import { useMetadata } from 'components/Skills/hooks'
import { useEffect } from 'react'

export function MetadataUpdater() {
  const metadataInfo = useMetadata(2)
  const [, setMetadataState] = useMetadataWriteAtom()

  useEffect(() => {
    if (!metadataInfo.realMetadata) return
    setMetadataState([metadataInfo.realMetadata])
  }, [metadataInfo.realMetadata, setMetadataState])

  return null
}
