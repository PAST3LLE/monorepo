import { Address } from '@past3lle/types'
import { useMemo } from 'react'

import { useSkillForgeMetadataUriMapReadAtom } from '../state'
import { SkillForgeMetadataUpdaterProps } from '../state/Metadata/updaters/MetadataUpdater'
import { CollectionMetadata, SkillMetadata } from '../types'
import { chainFetchIpfsUri } from '../utils'
import { useSkillForgeGetBatchSkillMetadataUris } from './contracts/useSkillForgeGetBatchSkillMetadataUris'
import { useRefetchOnAddress } from './useRefetchOnAddress'
import { useSupportedChainId } from './useSkillForgeSupportedChainId'

export function useSkillForgeFetchMetadata({ loadAmount = 3, metadataFetchOptions }: SkillForgeMetadataUpdaterProps) {
  const chainId = useSupportedChainId()
  const [metadataUriMap] = useSkillForgeMetadataUriMapReadAtom()
  const metadataUris = metadataUriMap?.[chainId]

  // get a list of all the skill erc1155 token URIs
  // starting from LATEST collectionId, and counting down <loadAmount> times
  const {
    uris: { data: skillErc1155MetadataUris = [], refetch: refetchSkills },
    addresses: skill1155Addresses
  } = useSkillForgeGetBatchSkillMetadataUris({
    loadAmount
  })

  useRefetchOnAddress(refetchSkills)

  return useMemo(async (): Promise<[number[][], Promise<SkillMetadata[]>[]]> => {
    // reverse array as we loop down
    if (!skillErc1155MetadataUris.length || !metadataUris?.collectionsManager) return [[], [Promise.resolve([])]]

    const promisedCollectionMetadata = []
    for (let i = 1; i < skillErc1155MetadataUris.length + 1; i++) {
      promisedCollectionMetadata.push(fetch(metadataUris.collectionsManager + i + '.json').then((res) => res.json()))
    }
    const collectionMetadata: CollectionMetadata[] = await Promise.all(promisedCollectionMetadata)

    if (collectionMetadata.length !== skillErc1155MetadataUris.length) {
      throw new Error(
        '[useSkillForgeFetchMetadata] Collection metadata length does not match skill erc1155 metadata length'
      )
    }

    const allMetadata = []
    const allMetadataIds = []
    for (let i = 0; i < collectionMetadata.length; i++) {
      const promisedSkillsMetadata: Promise<SkillMetadata>[] = []
      for (let j = 0; j < collectionMetadata[i].properties?.ids.length || 0; j++) {
        promisedSkillsMetadata.push(
          chainFetchIpfsUri(
            skillErc1155MetadataUris[i].replace('0.json', collectionMetadata[i].properties.ids[j] + '.json'),
            ...(metadataFetchOptions?.gatewayUris || [])
          ).then((res) => res?.json())
        )
      }
      allMetadataIds.push(collectionMetadata[i].properties.ids || [])
      allMetadata.push(
        Promise.all(promisedSkillsMetadata).then((res) =>
          res.map((meta) => _overrideMetadataObject(meta, skill1155Addresses[i]))
        )
      )
    }

    return [allMetadataIds, allMetadata]
  }, [
    metadataFetchOptions?.gatewayUris,
    metadataUris?.collectionsManager,
    skill1155Addresses,
    skillErc1155MetadataUris
  ])
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
  metadata.properties.id = newId
  return metadata
}
