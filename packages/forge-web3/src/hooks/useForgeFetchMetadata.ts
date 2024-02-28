import { devError } from '@past3lle/utils'
import { useEffect, useState } from 'react'
import { Address } from 'viem'

import { useForgeMetadataUriMapReadAtom } from '../state'
import { ForgeMetadataUpdaterProps } from '../state/Metadata/updaters/MetadataUpdater'
import { CollectionMetadata, SkillMetadata, SupportedForgeChainIds } from '../types'
import { CustomIpfsGatewayConfig, chainFetchIpfsUri, isIpfsUri } from '../utils'
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

    chainId: SupportedForgeChainIds | undefined
  }>({ data: undefined, chainId: undefined })

  useEffect(() => {
    if (!skillErc1155MetadataUris.length || !metadataUris?.collectionsManager) return

    async function fetchMetadata() {
      if (!skillErc1155MetadataUris.length || !metadataUris?.collectionsManager) return

      const promisedCollectionMetadata = []
      for (let i = 1; i < skillErc1155MetadataUris.length + 1; i++) {
        promisedCollectionMetadata.push(
          fetch(`${metadataUris.collectionsManager}${i}/0.json`).then((res) => res.json())
        )
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
          const promise = _returnMetadataImageFetchPromise(
            skillErc1155MetadataUris[i].result as string,
            collectionMetadata[i].properties.ids[j],
            skill1155Addresses[i],
            metadataFetchOptions?.gatewayUris
          )
          promisedSkillsMetadata[i].push(promise)
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
  const rawId = metadata.properties?.id?.toString() || '0000'

  let cleanedId
  if (rawId.match(/^(.*?)-/)) {
    cleanedId = rawId.replace(/^(.*?)-/, `${address}-`)
  } else {
    cleanedId = `${address}-${rawId}`
  }

  return cleanedId as `${Address}-${string}`
}

function _overrideMetadataObject(metadata: SkillMetadata, address: Address) {
  const newId = address ? deriveMetadataId(metadata, address) : '0x-0000'

  // has properties
  if (metadata?.properties) metadata.properties.id = newId
  // doesn't already have properties (it should but users can forget)
  else {
    console.warn(
      `
[@past3lle/forge-web3 --> WARNING! 
Some of your metadata objects are missing the "properties" object property. 
Please check that you are following the correct metadata schema:
@example:
{ id: 1234, dependencies: [{token: 1234, id: 1}], shopifyId: '0000', rarity: 'epic' }

For now a default is being used: { id: 0000, dependencies: [], shopifyId: '0000', rarity: 'common' }
`
    )
    metadata.properties = { id: newId, dependencies: [], shopifyId: '0000', rarity: 'common' }
  }

  return metadata
}

// ----- LOCAL FUNCTIONS ------- //
function _returnMetadataImageFetchPromise(
  uri: string,
  id: number,
  address1155: Address,
  gatewayUris?: CustomIpfsGatewayConfig[]
) {
  const metadataUri = uri?.replace('0.json', id + '.json')
  const ipfsUri = isIpfsUri(metadataUri)
  const fetchFn = async () => (ipfsUri ? chainFetchIpfsUri(metadataUri, ...(gatewayUris || [])) : fetch(metadataUri))

  return fetchFn()
    .then((res) => res?.json())
    .then((res) => _overrideMetadataObject(res, address1155))
}
