import { Address } from '@past3lle/types'
import { devError } from '@past3lle/utils'
import { useEffect, useState } from 'react'

import { useForgeMetadataUriMapReadAtom } from '../state'
import { ForgeMetadataUpdaterProps } from '../state/Metadata/updaters/MetadataUpdater'
import { CollectionMetadata, SkillMetadata, SupportedForgeChains } from '../types'
import { chainFetchIpfsUri } from '../utils'
import { useForgeGetBatchSkillMetadataUris } from './contracts/useForgeGetBatchSkillMetadataUris'
import { useSupportedOrDefaultChainId } from './useForgeSupportedChainId'
import { useRefetchOnAddressAndChain } from './useRefetchOnAddress'

export function useForgeFetchMetadata({ loadAmount = BigInt(3), metadataFetchOptions }: ForgeMetadataUpdaterProps) {
  const chainId = useSupportedOrDefaultChainId()
  const [metadataUriMap] = useForgeMetadataUriMapReadAtom()

  const metadataUris = chainId ? metadataUriMap?.[chainId] : undefined

  // get a list of all the skill erc1155 token URIs
  // starting from LATEST collectionId, and counting down <loadAmount> times
  const {
    uris: { data: skillErc1155MetadataUris = [], refetch: refetchSkills },
    addresses: skill1155Addresses
  } = useForgeGetBatchSkillMetadataUris({
    loadAmount
  })

  useRefetchOnAddressAndChain(refetchSkills)

  const [metadata, setMetadata] = useState<{
    data: Promise<SkillMetadata[]>[] | undefined

    chainId: SupportedForgeChains | undefined
  }>({ data: undefined, chainId: undefined })

  useEffect(() => {
    if (!skillErc1155MetadataUris.length || !metadataUris?.collectionsManager) return

    async function fetchMetadata() {
      const promisedCollectionMetadata = []
      for (let i = 1; i < skillErc1155MetadataUris.length + 1; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        promisedCollectionMetadata.push(fetch(metadataUris!.collectionsManager + i + '.json').then((res) => res.json()))
      }
      const collectionMetadata: CollectionMetadata[] = await Promise.all(promisedCollectionMetadata)

      if (collectionMetadata.length !== skillErc1155MetadataUris.length) {
        throw new Error(
          '[useForgeFetchMetadata] Collection metadata length does not match skill erc1155 metadata length'
        )
      }

      const promisedSkillsMetadata: Promise<SkillMetadata>[][] = []
      for (let i = 0; i < collectionMetadata.length; i++) {
        promisedSkillsMetadata.push([])
        for (let j = 0; j < collectionMetadata[i].properties?.ids.length || 0; j++) {
          promisedSkillsMetadata[i].push(
            chainFetchIpfsUri(
              (skillErc1155MetadataUris[i].result as string)?.replace(
                '0.json',
                collectionMetadata[i].properties.ids[j] + '.json'
              ),
              ...(metadataFetchOptions?.gatewayUris || [])
            )
              .then((res) => res?.json())
              .then((res) => _overrideMetadataObject(res, skill1155Addresses[i]))
          )
        }
      }
      return promisedSkillsMetadata.map((collection) => Promise.all(collection))
    }

    fetchMetadata()
      .then((res) => setMetadata({ data: res, chainId }))
      .catch((error) => {
        devError(error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadataFetchOptions?.gatewayUris, metadataUris?.collectionsManager, skillErc1155MetadataUris])

  return metadata
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
  if (typeof metadata === 'object' && 'properties' in metadata) {
    metadata.properties.id = newId
  }
  return metadata
}
