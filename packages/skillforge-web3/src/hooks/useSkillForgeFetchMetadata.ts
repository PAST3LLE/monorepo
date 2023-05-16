import { useMemo } from 'react'

import { SkillForgeMetadataState } from '../state'
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

  // get a list of all the skill erc1155 token URIs
  // starting from LATEST collectionId, and counting down <loadAmount> times
  const { data: skillErc1155MetadataUris = [] } = useSkillForgeGetBatchSkillMetadataUris({
    loadAmount,
    contractAddressMap
  })

  return useMemo(async (): Promise<SkillForgeMetadataState['metadata']> => {
    const filteredSkillErc1155MetadataUris = skillErc1155MetadataUris.filter(Boolean).reverse() as string[]
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
      const size = collectionMetadata[i].properties.size
      const promisedSkillsMetadata: Promise<SkillMetadata>[] = []
      for (let j = 0; j < size; j++) {
        const skillId = get64PaddedSkillId(j, idBase)
        const uri = ipfsToImageUri(filteredSkillErc1155MetadataUris[i].replace('{id}', skillId))
        promisedSkillsMetadata.push(fetch(uri).then((res) => res.json()))
      }
      allMetadata.push({ size, skillsMetadata: await Promise.all(promisedSkillsMetadata) })
    }

    return allMetadata
  }, [metadataUris, loadAmount])
}
