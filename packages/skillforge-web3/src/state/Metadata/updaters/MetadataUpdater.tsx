import { devError, devWarn } from '@past3lle/utils'
import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'

import { SkillForgeMetadataState, useSkillForgeMetadataMapWriteAtom, useSkillForgeMetadataWriteAtom } from '..'
import { useSkillForgeFetchMetadata, useSkillForgePrepareCollectionsContract } from '../../../hooks'
import { MOCK_ALL_SKILLS_METADATA } from '../../../mock/metadata'
import { SkillForgeContractAddressMap, SkillForgeMetadataUriMap, SkillMetadata } from '../../../types'

export interface MetadataFetchOptions {
  mock?: boolean
  mockData?: SkillMetadata[][]
}
export interface SkillForgeMetadataUpdaterProps {
  metadataUriMap: SkillForgeMetadataUriMap
  contractAddressMap: SkillForgeContractAddressMap
  idBase?: number
  loadAmount?: number
  metadataFetchOptions?: MetadataFetchOptions
}
export function SkillForgeMetadataUpdater(props: SkillForgeMetadataUpdaterProps) {
  const collectionsConfig = useSkillForgePrepareCollectionsContract(props.contractAddressMap)
  const { data: collections } = useContractRead({ ...collectionsConfig, functionName: 'totalSupply' })

  const metadataList = useSkillForgeFetchMetadata({
    loadAmount: collections?.toNumber() || 0,
    metadataUriMap: props.metadataUriMap,
    contractAddressMap: props.contractAddressMap,
    idBase: props.idBase
  })

  const [, setMetadataState] = useSkillForgeMetadataWriteAtom()
  const [, setMetadataMapState] = useSkillForgeMetadataMapWriteAtom()

  const [localMetadata, setLocalMetadata] = useState<SkillForgeMetadataState['metadata']>([])

  useEffect(() => {
    metadataList
      .then((res) => {
        const data = _getEnvMetadata(res || [], props?.metadataFetchOptions)
        setLocalMetadata(data?.filter((meta) => !!meta?.size) || [])
      })
      .catch(devError)
  }, [collections?.toNumber(), props.loadAmount])

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
  }[],
  options: MetadataFetchOptions = {
    mock: false,
    mockData: MOCK_ALL_SKILLS_METADATA
  }
): SkillForgeMetadataState['metadata'] {
  const SHOW_MOCK_DATA = !!(options?.mock || process.env.REACT_APP_MOCK_METADATA)
  if (!SHOW_MOCK_DATA) {
    return realMetadata
  } else {
    devWarn('[MetadataUpdater]::USING MOCK METADATA')
    return MOCK_ALL_SKILLS_METADATA.map((coll: SkillMetadata[]) => ({
      size: coll.length,
      skillsMetadata: coll
    }))
  }
}
