import { Address } from '@past3lle/types'
import { useMemo } from 'react'

import { SkillForgeMetadataUpdaterProps } from '../state/Metadata/updaters/MetadataUpdater'
import { SkillMetadata } from '../types'
import { chainFetchIpfsUri, get64PaddedSkillId } from '../utils'
import { useSkillForgeGetBatchSkillMetadataUris } from './contracts/useSkillForgeGetBatchSkillMetadataUris'
import { useRefetchOnAddress } from './useRefetchOnAddress'
import { useSupportedChainId } from './useSkillForgeSupportedChainId'

export function useSkillForgeFetchMetadata({
  contractAddressMap,
  metadataUriMap,
  idBase,
  loadAmount = 3,
  metadataFetchOptions
}: SkillForgeMetadataUpdaterProps) {
  const chainId = useSupportedChainId()
  const metadataUris = metadataUriMap[chainId]

  // get a list of all the skill erc1155 token URIs
  // starting from LATEST collectionId, and counting down <loadAmount> times
  const {
    uris: { data: skillErc1155MetadataUris = [], refetch: refetchSkills },
    addresses: skill1155Addresses
  } = useSkillForgeGetBatchSkillMetadataUris({
    loadAmount,
    contractAddressMap
  })

  useRefetchOnAddress(refetchSkills)

  return useMemo(async (): Promise<{ size: number; skillsMetadata: SkillMetadata[] }[]> => {
    // reverse array as we loop down
    const filteredSkillErc1155MetadataUris = skillErc1155MetadataUris.filter(Boolean) as string[]
    if (!filteredSkillErc1155MetadataUris.length || !metadataUris?.collectionsManager)
      return [{ size: 0, skillsMetadata: [] }]

    const promisedCollectionMetadata = []
    for (let i = 1; i < filteredSkillErc1155MetadataUris.length + 1; i++) {
      promisedCollectionMetadata.push(
        (await fetch(metadataUris.collectionsManager.replace('{id}', i.toString()))).json()
      )
    }
    const collectionMetadata = await Promise.all(promisedCollectionMetadata)

    const allMetadata = []
    for (let i = 0; i < collectionMetadata.length; i++) {
      const size: number = collectionMetadata[i].properties.size
      const promisedSkillsMetadata: Promise<SkillMetadata>[] = []
      for (let j = 0; j < size; j++) {
        const skillId = get64PaddedSkillId(j, idBase)

        promisedSkillsMetadata.push(
          chainFetchIpfsUri(
            filteredSkillErc1155MetadataUris[i].replace('{id}', skillId),
            ...(metadataFetchOptions?.gatewayUris || [])
          ).then((res) => res?.json())
        )
      }
      allMetadata.push({
        size,
        skillsMetadata: (await Promise.all(promisedSkillsMetadata)).map((meta) =>
          _overrideMetadataObject(meta, skill1155Addresses[i] as Address)
        )
      })
    }

    return allMetadata
  }, [metadataUris, loadAmount, skillErc1155MetadataUris])
}

export function deriveMetadataId(metadata: SkillMetadata, address: Address): `${Address}-${string}` {
  const rawId = metadata.properties.id.toString()

  let cleanedId
  if (rawId.match(/^(.*?)-/)) {
    cleanedId = rawId.replace(/^(.*?)-/, `${address}-`)
  } else {
    cleanedId = `${address}-${rawId}`
  }

  return cleanedId as `${Address}-${string}`
}

function _overrideMetadataObject(metadata: SkillMetadata, address: Address) {
  const newId = metadata?.properties?.id ? deriveMetadataId(metadata, address) : '0x-0000'

  return {
    ...metadata,
    properties: {
      ...metadata.properties,
      id: newId
    }
  }
}
