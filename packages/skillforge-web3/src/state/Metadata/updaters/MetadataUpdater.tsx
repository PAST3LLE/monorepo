import { devError, devWarn } from '@past3lle/utils'
import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'

import { SkillForgeMetadataState, useSkillForgeMetadataMapWriteAtom, useSkillForgeMetadataWriteAtom } from '..'
import { useSkillForgeFetchMetadataCallback, useSkillForgePrepareCollectionsContract } from '../../../hooks'
import mockMetadata from '../../../mock/metadata/fullMetadata'
import { SkillForgeContractAddressMap, SkillForgeMetadataUriMap, SkillMetadata } from '../../../types'

export interface SkillForgeMetadataUpdaterProps {
  metadataUriMap: SkillForgeMetadataUriMap
  contractAddressMap: SkillForgeContractAddressMap
  idBase?: number
}
export function SkillForgeMetadataUpdater(props: SkillForgeMetadataUpdaterProps) {
  const fetchMetadata = useSkillForgeFetchMetadataCallback({
    metadataUriMap: props.metadataUriMap,
    idBase: props.idBase
  })

  const collectionsConfig = useSkillForgePrepareCollectionsContract(props.contractAddressMap)
  const { data: collections } = useContractRead({ ...collectionsConfig, functionName: 'totalSupply' })

  const [, setMetadataState] = useSkillForgeMetadataWriteAtom()
  const [, setMetadataMapState] = useSkillForgeMetadataMapWriteAtom()

  const [localMetadata, setLocalMetadata] = useState<SkillForgeMetadataState['metadata']>([])

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
      .catch(devError)
  }, [collections, fetchMetadata])

  useEffect(() => {
    if (!localMetadata?.length) return

    const metadataMap = localMetadata
      .flatMap((item) => item.skillsMetadata)
      .reduce((acc, next) => {
        const id = next.properties.id
        acc[id] = next
        return acc
      }, {} as SkillForgeMetadataState['metadataMap'])

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
): SkillForgeMetadataState['metadata'] {
  // TODO: remove this
  const SHOW_MOCK_DATA = !!process.env.REACT_APP_MOCK_METADATA
  if (!SHOW_MOCK_DATA) {
    return realMetadata
  } else {
    devWarn('[MetadataUpdater]::USING MOCK METADATA')
    return (mockMetadata as any[]).map((coll: SkillMetadata[]) => ({
      size: coll.length,
      skillsMetadata: coll
    }))
  }
}
