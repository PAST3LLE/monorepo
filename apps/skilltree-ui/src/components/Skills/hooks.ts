import { CollectionMetadata, SkillMetadata } from './types'
// import { getHash } from './utils'
// import { delay } from '@past3lle/utils'
import { ref, getDownloadURL } from 'firebase/storage'
import { COLLECTION_CONTRACTS_MAP, mockGetContract } from 'mock/contracts'
// import { GATEWAY_URI } from 'constants/ipfs'
import {
  MOCK_ALL_SKILLS_METADATA,
  /* MOCK_COLLECTIONS_DATA, MOCK_SKILLS_COLLECTION_0 */
} from 'mock/metadata'
import {
  useCallback,
  /* useState, */
  useEffect,
} from 'react'
import { useFirebaseStorageAtomRead } from 'state/Firebase'

export interface UseMetaData {
  skills: (SkillMetadata[] | undefined)[]
  collection: CollectionMetadata | undefined
  collectionsMetadataList: CollectionMetadata[] | undefined
}
export function useMetadata(/* collectionId?: number */) {
  // const [skills, setSkills] = useState<(SkillMetadata[] | undefined)[]>([])
  // const [collection, setCollectionMetadata] = useState<CollectionMetadata>()
  // const [collectionsMetadataList, setCollectionsMetadataList] = useState<CollectionMetadata[]>()

  const [state] = useFirebaseStorageAtomRead()
  const storageRef = ref(state.firebaseStorage)

  const getCollectionsMetadataAndSkillInfo = useCallback(async () => {
    const collections721 = COLLECTION_CONTRACTS_MAP.CONTRACT_COLLECTIONS

    const uri = await collections721.getUri(1)
    const supply = await collections721.totalSupply()

    const promised = []
    for (let i = 1; i <= supply.toNumber(); i++) {
      promised.push(collections721.getSkillsAddress(i))
    }

    return {
      uri,
      supply,
      skillsAddressList: await Promise.all(promised),
    }
  }, [])

  const getCollectionSkillsInfoCallback = useCallback(async () => {
    const { /* uri, */ supply, skillsAddressList } = await getCollectionsMetadataAndSkillInfo()
    // console.log('SKILLS ADDRESS LIST', skillsAddressList)

    const promisedSkillsContracts = []
    const promisedMetadata = []
    for (let i = 1; i <= supply.toNumber(); i++) {
      // const builtUri = uri.replace('1', `${i}/metadata.json`)
      const currentRef = ref(storageRef, `${i}/metadata.json`)
      const contract = mockGetContract(skillsAddressList[i - 1])
      // console.log('CONTRACT SKILL @ ', i, contract)

      promisedSkillsContracts.push(contract)
      promisedMetadata.push(
        getDownloadURL(currentRef)
          .then((res) => fetch(res))
          .then((res) => res.json())
      )
    }
    const contractsList = await Promise.all(promisedSkillsContracts)
    const metadata = await Promise.all(promisedMetadata)
    // console.debug('METADATA COLLECTIONS', metadata, contractsList)

    const skillSupplies = []
    const promisedUris = []
    for (let i = 0; i < metadata.length; i++) {
      const key = (i + 1) * 1000
      // const { CONTRACT_COLLECTIONS, ...COLLECTION_SKILLS } = COLLECTION_CONTRACTS_MAP
      promisedUris.push(contractsList[i].uri(i).then((res) => res.replace('{id}', `${key}`)))
      skillSupplies.push(metadata[i].properties.skills)
    }
    /* const urisList =  */ await Promise.all(promisedUris)
    // console.log('SKILL SUPPLIES', skillSupplies)
    // console.log('SKILL URIs', urisList)
  }, [getCollectionsMetadataAndSkillInfo, storageRef])

  /* useEffect(() => {
    _fetchCollectionsMetadata()
      .then((res) => setCollectionsMetadataList(res))
      .catch((error) => {
        console.error('[useSkills]::ERROR FETCHING COLLECTIONS METADATA LIST', new Error(error))
      })
  }, [])

  useEffect(() => {
    console.debug('[useSkills]::Fetching freshest collection metadata')
    if (collectionsMetadataList) {
      setCollectionMetadata(collectionsMetadataList.slice().pop())
    }
  }, [collectionsMetadataList])

  useEffect(() => {
    if (!collectionsMetadataList) return
    console.debug('[useSkills]::Fetching freshest skills metadata')
    const promisedCollectionsMapped = collectionsMetadataList.map((collection) =>
      _fetchCollectionSkillsMetadata(collection)
    )
    Promise.all(promisedCollectionsMapped)
      .then((res) => setSkills(res))
      .catch((error) => {
        console.error('[useSkills]::ERROR FETCHING COLLECTIONS METADATA LIST', new Error(error))
      })
  }, [collectionsMetadataList]) */

  useEffect(() => {
    getCollectionSkillsInfoCallback().then(console.debug)
  }, [getCollectionSkillsInfoCallback])

  return { skillsMetadata: MOCK_ALL_SKILLS_METADATA }
}

// async function _fetchCollectionsMetadata() {
//   // TODO: call Promise all([ skillADdress(), totalSupply() ]) on PSTLCollections contract
//   /* e.g
//     const [skillAddress, totalCollections] = await Promise.all([
//       collectionsContract.getSkillAddress(),
//       collectionsContract.totalSupply()
//     ])
//   */
//   const [skillAddress, totalCollections] = await Promise.all([
//     delay(154, '0xSomeSkillAddressCollection'),
//     delay(272, MOCK_COLLECTIONS_DATA.length),
//   ])

//   console.log('Skill address:', skillAddress)

//   // TODO: use skillAddress and get contract
//   // e.g
//   /*
//     const contract = await getContract(skillAddress, PSTLCollectionBaseSkill.abi)
//   */
//   const skillContract = await delay(134, COLLECTION_CONTRACTS_MAP.CONTRACT_SKILLS_1)
//   const skillsUri = await skillContract.uri(1)

//   const promisedCollectionMetdata = []
//   for (let i = 1; i <= totalCollections; i++) {
//     const key = i * 1000
//     const builtUrl = `${skillsUri}/metadata/${key}.json`
//     // TODO: use below
//     // promisedCollectionMetdata.push(fetch(`https://ik.imagekit.io/pastelle/SKILLS/COLLECTIONS/${i}`))
//     promisedCollectionMetdata.push(delay(120, builtUrl))
//   }

//   return Promise.all(promisedCollectionMetdata)
// }

// async function _fetchCollectionSkillsMetadata(
//   collectionMetadata: CollectionMetadata
// ): Promise<SkillMetadata[] | undefined> {
//   const totalSkills = collectionMetadata?.properties?.skills
//   if (!totalSkills) return undefined

//   const mockContract = await delay<{ uri(id: number): Promise<string> }>(320, {
//     async uri(id: number): Promise<string> {
//       console.debug('Fetchihg URI for id', id)
//       return 'ipfs://QmPf95AjYdgsTsZ9BcqqabYB4pdFgLoAQhnHN93UbDswio/{id}.json'
//     },
//   })

//   const skillMetadataUriPromises: Promise<string>[] = []
//   for (let i = 0; i < totalSkills; i++) {
//     skillMetadataUriPromises.push(mockContract.uri(i))
//   }

//   const metadataUris = (await Promise.all(skillMetadataUriPromises)).map((uri, index) =>
//     uri.replace('{id}', index.toString().padStart(64, '0'))
//   )
//   const metadata: SkillMetadata[] = await Promise.all(
//     metadataUris.map(async (_, idx) => {
//       // const formattedUri = getHash(uri)
//       // return await fetch(`${GATEWAY_URI}/${formattedUri}`).then((res) => res.json())
//       return MOCK_SKILLS_COLLECTION_0[idx]
//     })
//   )

//   return metadata
// }
