import { useMetadataWriteAtom, useMetadataMapWriteAtom, MetadataState } from '..'
import { useFetchMetadataCallback } from 'components/Skills/hooks'
import { SkillMetadata } from 'components/Skills/types'
import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'
import { SkillsCollectionIdGoerli } from 'web3/constants/addresses'
import { usePrepareCollectionsContract } from 'web3/hooks/collections/usePrepareCollectionsContract'

export function MetadataUpdater() {
  const fetchMetadata = useFetchMetadataCallback()

  const collectionsConfig = usePrepareCollectionsContract()
  const { data: collections } = useContractRead({ ...collectionsConfig, functionName: 'totalSupply' })

  const [, setMetadataState] = useMetadataWriteAtom()
  const [, setMetadataMapState] = useMetadataMapWriteAtom()

  const [localMetadata, setLocalMetadata] = useState<SkillMetadata[][]>([])

  useEffect(() => {
    async function _fetchMetadata() {
      const totalCollections = collections?.toNumber()
      if (!totalCollections) return null

      const promisedMetadata = []
      for (let i = 1; i < totalCollections; i++) {
        promisedMetadata.push(fetchMetadata(i as SkillsCollectionIdGoerli))
      }

      return Promise.all(promisedMetadata)
    }

    _fetchMetadata()
      .then((res) => setLocalMetadata(res?.filter((meta) => !!meta?.length) || []))
      .catch(console.error)
  }, [collections, fetchMetadata])

  useEffect(() => {
    if (!localMetadata?.length) return

    const metadataMap = localMetadata
      .flatMap((item) => item)
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
