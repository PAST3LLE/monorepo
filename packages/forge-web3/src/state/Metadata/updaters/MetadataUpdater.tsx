import { devError } from '@past3lle/utils'
import { useEffect } from 'react'
import { useContractRead } from 'wagmi'

import { ForgeMetadataState, useForgeMetadataAtom, useForgeMetadataMapWriteAtom } from '..'
import { useForgeFetchMetadata, useForgePrepareCollectionsContract } from '../../../hooks'
import { WAGMI_SCOPE_KEYS } from '../../../hooks/constants'
import { WithLoadAmount } from '../../../hooks/types'
import { SkillMetadata } from '../../../types'
import { CustomIpfsGatewayConfig } from '../../../utils/ipfs'

export interface MetadataFetchOptions {
  mock?: boolean
  mockData?: SkillMetadata[][]
  gatewayUris?: CustomIpfsGatewayConfig[]
  gatewayApiUris?: CustomIpfsGatewayConfig[]
}
export type ForgeMetadataUpdaterProps = {
  metadataFetchOptions?: MetadataFetchOptions
} & Partial<WithLoadAmount>

export function ForgeMetadataUpdater(props: ForgeMetadataUpdaterProps) {
  const collectionsConfig = useForgePrepareCollectionsContract()
  const { data: collections } = useContractRead({
    ...collectionsConfig,
    functionName: 'totalSupply',
    scopeKey: WAGMI_SCOPE_KEYS.COLLECTIONS_MANAGER_TOTAL_SUPPLY
  })

  const promisedMetadataTuple = useForgeFetchMetadata({
    loadAmount: collections?.toNumber() || 0,
    metadataFetchOptions: props.metadataFetchOptions
  })

  const [metadata, setMetadataState] = useForgeMetadataAtom()
  const [, setMetadataMapState] = useForgeMetadataMapWriteAtom()

  useEffect(() => {
    async function resolveMetadata() {
      try {
        const [idsTuple, promisedSkillsMetadatas] = await promisedMetadataTuple
        const skillMetadata = await Promise.all(promisedSkillsMetadatas)

        const data = _getEnvMetadata(idsTuple, skillMetadata || [])
        // Post new metadata if it exists
        if (data?.length) {
          setMetadataState(data)
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
      }, {} as ForgeMetadataState['metadataMap'][number])

    setMetadataMapState(metadataMap)
  }, [metadata, setMetadataMapState])

  return null
}

function _getEnvMetadata(
  ids: number[][],
  metadata: ForgeMetadataState['metadata'][number][0]['skillsMetadata'][]
): ForgeMetadataState['metadata'][number] {
  return metadata.reduce((acc, meta, i) => {
    if (!!ids?.[i]?.length) {
      acc.push({
        ids: ids[i],
        skillsMetadata: meta
      })
    }
    return acc
  }, [] as ForgeMetadataState['metadata'][number])
}
