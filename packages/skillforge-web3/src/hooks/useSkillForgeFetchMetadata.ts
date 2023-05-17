import { useMemo } from 'react'
import { Address, useAccount } from 'wagmi'

import { SkillForgeMetadataUpdaterProps } from '../state/Metadata/updaters/MetadataUpdater'
import { SkillMetadata } from '../types'
import { get64PaddedSkillId, ipfsToImageUri } from '../utils'
import { useSkillForgeGetBatchSkillMetadataUris } from './contracts/useSkillForgeGetBatchSkillMetadataUris'
import { useSupportedChainId } from './useSkillForgeSupportedChainId'

export function useSkillForgeFetchMetadata({
  contractAddressMap,
  metadataUriMap,
  idBase,
  loadAmount = 10
}: SkillForgeMetadataUpdaterProps) {
  const chainId = useSupportedChainId()
  const metadataUris = metadataUriMap[chainId]

  const { address } = useAccount()

  // get a list of all the skill erc1155 token URIs
  // starting from LATEST collectionId, and counting down <loadAmount> times
  const {
    uris: { data: skillErc1155MetadataUris = [] },
    addresses: skill1155Addresses
  } = useSkillForgeGetBatchSkillMetadataUris({
    loadAmount,
    contractAddressMap
  })

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
        const uri = ipfsToImageUri(filteredSkillErc1155MetadataUris[i].replace('{id}', skillId))
        promisedSkillsMetadata.push(fetch(uri).then((res) => res.json()))
      }
      allMetadata.push({
        size,
        skillsMetadata: (await Promise.all(promisedSkillsMetadata)).map((meta) =>
          _overrideMetadataObject(meta, skill1155Addresses[i] as Address)
        )
      })
    }

    return allMetadata
  }, [metadataUris, loadAmount, address])
}

export function deriveMetadataId(metadata: SkillMetadata, address: Address): `${Address}-${string}` {
  const rawId = metadata?.properties?.id?.toString()

  if (!rawId) throw new Error('Missing Skill ID in skill metadata!')

  let cleanedId
  if (rawId.match(/^(.*?)-/)) {
    cleanedId = rawId.replace(/^(.*?)-/, `${address}-`)
  } else {
    cleanedId = `${address}-${rawId}`
  }

  return cleanedId as `${Address}-${string}`
}

function _overrideMetadataObject(metadata: SkillMetadata, address: Address) {
  const newId = deriveMetadataId(metadata, address)

  return {
    ...metadata,
    properties: {
      ...metadata.properties,
      id: newId
    }
  }
}
