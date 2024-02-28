import { devError } from '@past3lle/utils'
import { useEffect } from 'react'
import { useReadContract } from 'wagmi'

import { ForgeMetadataState, useForgeMetadataAtom } from '..'
import { CONTRACT_COLLECTIONS_MANAGER_PARAMETERS } from '../../../constants/contracts'
import { useForgeFetchMetadata } from '../../../hooks'
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
  const { data: collections } = useReadContract({
    ...CONTRACT_COLLECTIONS_MANAGER_PARAMETERS,
    functionName: 'totalSupply',
    args: [],
    scopeKey: WAGMI_SCOPE_KEYS.COLLECTIONS_MANAGER_TOTAL_SUPPLY
  })

  const { data: promisedMetadata, chainId } = useForgeFetchMetadata({
    loadAmount: (collections as { result?: bigint })?.result || BigInt(2),
    metadataFetchOptions: props.metadataFetchOptions
  })

  const [, setMetadataState] = useForgeMetadataAtom()

  useEffect(() => {
    if (!chainId || !promisedMetadata) return

    async function resolveMetadata() {
      if (!chainId || !promisedMetadata) return

      try {
        const metadataTuple = await Promise.all(promisedMetadata)
        // Post new metadata if it exists
        if (metadataTuple?.length) {
          const metadataMap = metadataTuple
            .flatMap((collection) => [...collection])
            .reduce((acc, meta) => {
              if (meta?.properties?.id) {
                acc[meta.properties.id] = meta
              }
              return acc
            }, {} as ForgeMetadataState['metadataMap'][number])

          setMetadataState((state) => ({
            metadata: {
              ...state.metadata,
              [chainId]: metadataTuple
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
  }, [chainId, promisedMetadata, setMetadataState])

  return null
}
