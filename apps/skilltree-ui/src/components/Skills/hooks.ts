import { CollectionMetadata, SkillMetadata } from './types'
import { get64PaddedSkillId, ipfsToImageUri } from './utils'
import { MOCK_COLLECTION_ERROR_OFFSET, SKILL_ID_BASE } from 'constants/skills'
import { BigNumber } from 'ethers'
import { MOCK_ALL_SKILLS_METADATA } from 'mock/metadata'
import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'
import { usePrepareCollectionsContract } from 'web3/hooks/collections/usePrepareCollectionsContract'

export interface UseMetaData {
  skills: (SkillMetadata[] | undefined)[]
  collection: CollectionMetadata | undefined
  collectionsMetadataList: CollectionMetadata[] | undefined
}
export function useMetadata(collectionId: number) {
  const config = usePrepareCollectionsContract()
  const { data: uri } = useContractRead({
    ...config,
    functionName: 'tokenURI',
    args: [BigNumber.from(collectionId - MOCK_COLLECTION_ERROR_OFFSET)]
  })
  const { data: skillsMetadataUri } = useContractRead({
    ...config,
    functionName: 'getSkillsMetadataUri',
    args: [BigNumber.from(collectionId), BigNumber.from(SKILL_ID_BASE)]
  })

  const [skillsMetadata, setSkillsMetadata] = useState<SkillMetadata[] | undefined>([])

  useEffect(() => {
    if (!skillsMetadataUri) return

    async function getMetadata() {
      if (!skillsMetadataUri) return
      const collectionMetadata = await (await fetch(uri + '.json')).json()

      const promisedSkillsMetadata: Promise<SkillMetadata>[] = []
      for (let i = 0; i < collectionMetadata.properties.size; i++) {
        const skillId = get64PaddedSkillId(i)
        const uri = ipfsToImageUri(skillsMetadataUri.replace('{id}', skillId))
        promisedSkillsMetadata.push(fetch(uri).then((res) => res.json()))
      }

      return Promise.all(promisedSkillsMetadata)
    }

    getMetadata()
      .then((res) => setSkillsMetadata(res))
      .catch(console.error)
  }, [skillsMetadataUri, uri])

  return { skillsMetadata: MOCK_ALL_SKILLS_METADATA, realMetadata: skillsMetadata }
}
