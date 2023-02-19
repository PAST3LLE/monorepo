import { useMetadataWriteAtom, useMetadataMapWriteAtom, MetadataState } from '..'
import { useFetchMetadataCallback } from 'components/Skills/hooks'
import { SkillMetadata } from 'components/Skills/types'
import mockMetadata from 'mock/metadata/fullMetadata.js'
import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'
import { usePrepareCollectionsContract } from 'web3/hooks/collections/usePrepareCollectionsContract'

export function MetadataUpdater() {
  const fetchMetadata = useFetchMetadataCallback()

  const collectionsConfig = usePrepareCollectionsContract()
  const { data: collections } = useContractRead({ ...collectionsConfig, functionName: 'totalSupply' })

  const [, setMetadataState] = useMetadataWriteAtom()
  const [, setMetadataMapState] = useMetadataMapWriteAtom()

  const [localMetadata, setLocalMetadata] = useState<MetadataState['metadata']>([])

  useEffect(() => {
    async function _fetchMetadata() {
      const totalCollections = collections?.toNumber()
      if (!totalCollections) return null

      const promisedMetadata = []
      for (let i = 1; i < totalCollections; i++) {
        promisedMetadata.push(fetchMetadata(i))
      }

      return Promise.all(promisedMetadata)
    }

    _fetchMetadata()
      .then((res) => {
        const data = _getEnvMetadata(res || [])
        setLocalMetadata(data?.filter((meta) => !!meta?.size) || [])
      })
      .catch(console.error)
  }, [collections, fetchMetadata])

  useEffect(() => {
    if (!localMetadata?.length) return

    const metadataMap = localMetadata
      .flatMap((item) => item.skillsMetadata)
      .reduce((acc, next) => {
        const id = next.properties.id
        acc[id] = next
        return acc
      }, {} as MetadataState['metadataMap'])

    setMetadataState(localMetadata)
    setMetadataMapState(metadataMap)
  }, [localMetadata, setMetadataMapState, setMetadataState])

  return null
}

function _getEnvMetadata(
  realMetadata: {
    size: number
    skillsMetadata: SkillMetadata[]
  }[]
): MetadataState['metadata'] {
  // TODO: remove this
  const SHOW_MOCK_DATA = !!process.env.REACT_APP_MOCK_METADATA
  if (!SHOW_MOCK_DATA) {
    return realMetadata
  } else {
    console.warn('[MetadataUpdater]::USING MOCK METADATA')
    return (mockMetadata as any[]).map((coll: SkillMetadata[]) => ({
      size: coll.length,
      skillsMetadata: coll
    }))
  }
}
