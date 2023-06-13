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

  const { data, chainId } = useForgeFetchMetadata({
    loadAmount: collections?.toNumber() || 0,
    metadataFetchOptions: props.metadataFetchOptions
  })

  const [, setMetadataMapState] = useForgeMetadataMapWriteAtom(chainId)
  const [, setMetadataState] = useForgeMetadataAtom()

  useEffect(() => {
    async function resolveMetadata() {
      try {
        if (!chainId) return

        const metadata = await Promise.all(data)
        // Post new metadata if it exists
        if (metadata?.length) {
          const metadataMap = metadata.reduce((acc, meta) => {
            if (meta?.properties?.id) {
              acc[meta.properties.id] = meta
            }
            return acc
          }, {} as ForgeMetadataState['metadataMap'][number])

          setMetadataState((state) => ({
            metadata: {
              ...state.metadata,
              [chainId]: new Map([[1, data]])
            },
            metadataMap: {
              ...state.metadataMap,
              [chainId]: {
                ...state.metadataMap[chainId],
                ...metadataMap
              }
            }
          }))
        }
      } catch (error) {
        devError(error)
      }
    }

    resolveMetadata()
  }, [promisedMetadataTuple, props.metadataFetchOptions, setMetadataMapState, setMetadataState])

  return null
}

function _getEnvMetadata(
  metadataAndId: { id: number; metadata: SkillMetadata }[]
): ForgeMetadataState['metadata'][number] {
  return metadataAndId.reduce((acc, { metadata, id }) => {
    acc.push({
      ids: id,
      skillsMetadata: metadata
    })

    return acc
  }, [] as ForgeMetadataState['metadata'][number])
}
