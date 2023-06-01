import { devError, devWarn } from '@past3lle/utils'
import { useEffect } from 'react'
import { useContractRead } from 'wagmi'

import { SkillForgeMetadataState, useSkillForgeMetadataAtom } from '..'
import { useSkillForgeFetchMetadata, useSkillForgePrepareCollectionsContract } from '../../../hooks'
import { WAGMI_SCOPE_KEYS } from '../../../hooks/constants'
import { WithLoadAmount } from '../../../hooks/types'
import { MOCK_ALL_SKILLS_METADATA } from '../../../mock/metadata'
import { SkillMetadata } from '../../../types'
import { CustomIpfsGatewayConfig } from '../../../utils/ipfs'

export interface MetadataFetchOptions {
  mock?: boolean
  mockData?: SkillMetadata[][]
  gatewayUris?: CustomIpfsGatewayConfig[]
  gatewayApiUris?: CustomIpfsGatewayConfig[]
}
export type SkillForgeMetadataUpdaterProps = {
  metadataFetchOptions?: MetadataFetchOptions
} & Partial<WithLoadAmount>

export function SkillForgeMetadataUpdater(props: SkillForgeMetadataUpdaterProps) {
  const collectionsConfig = useSkillForgePrepareCollectionsContract()
  const { data: collections } = useContractRead({
    ...collectionsConfig,
    functionName: 'totalSupply',
    scopeKey: WAGMI_SCOPE_KEYS.COLLECTIONS_MANAGER_TOTAL_SUPPLY
  })

  const promisedMetadataTuple = useSkillForgeFetchMetadata({
    loadAmount: collections?.toNumber() || 0,
    metadataFetchOptions: props.metadataFetchOptions
  })

  const [{ metadata }, setMetadataState] = useSkillForgeMetadataAtom()

  useEffect(() => {
    async function resolveMetadata() {
      try {
        const [idsTuple, promisedSkillsMetadatas] = await promisedMetadataTuple
        const skillMetadata = await Promise.all(promisedSkillsMetadatas)

        const data = _getEnvMetadata(idsTuple, skillMetadata || [], props?.metadataFetchOptions)
        // Post new metadata if it exists
        if (data?.length) {
          setMetadataState((state) => ({ ...state, metadata: data }))
        }
      } catch (error) {
        devError(error)
      }
    }

    resolveMetadata()
  }, [promisedMetadataTuple, props?.metadataFetchOptions, setMetadataState])

  // Reduce metadata to a map
  useEffect(() => {
    if (!metadata?.length) return

    const metadataMap = metadata
      .flatMap((item) => item.skillsMetadata)
      .reduce((acc, next) => {
        const id = next?.properties?.id
        if (id) {
          acc[id] = next
        }
        return acc
      }, {} as SkillForgeMetadataState['metadataMap'])

    setMetadataState((state) => ({ ...state, metadataMap }))
  }, [metadata, setMetadataState])

  return null
}

function _getEnvMetadata(
  ids: number[][],
  realMetadata: SkillForgeMetadataState['metadata'][0]['skillsMetadata'][],
  options: MetadataFetchOptions = {
    mock: false,
    mockData: MOCK_ALL_SKILLS_METADATA
  }
): SkillForgeMetadataState['metadata'] {
  const SHOW_MOCK_DATA = !!(options?.mock || process.env.REACT_APP_MOCK_METADATA)
  if (!SHOW_MOCK_DATA) {
    return realMetadata.reduce((acc, meta, i) => {
      if (!!ids?.[i]?.length) {
        acc.push({
          ids: ids[i],
          skillsMetadata: meta
        })
      }
      return acc
    }, [] as SkillForgeMetadataState['metadata'])
  } else {
    devWarn('[MetadataUpdater]::USING MOCK METADATA')
    return MOCK_ALL_SKILLS_METADATA.map((coll: SkillMetadata[]) => ({
      size: coll.length,
      ids: [1000, 2000, 3000],
      skillsMetadata: coll
    }))
  }
}
