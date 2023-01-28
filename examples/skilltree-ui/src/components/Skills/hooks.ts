import { delay } from '@past3lle/utils'
import * as React from 'react'

import { GATEWAY_URI } from '../../constants/ipfs'
import { MOCK_COLLECTIONS_DATA } from '../../mock/metadata'
import { CollectionMetadata, SkillMetadata } from './types'
import { getHash } from './utils'

export function useMetadata(): { skills: SkillMetadata[]; collection: CollectionMetadata | undefined } {
  const [skills, setSkills] = React.useState<SkillMetadata[]>([])
  const [collection, setCollectionMetadata] = React.useState<CollectionMetadata>()

  React.useEffect(() => {
    console.debug('[useSkills]::Fetching freshest collection metadata')
    _fetchFreshestCollectionMetadata()
      .then((res) => setCollectionMetadata(res))
      .catch((error) => {
        console.error('[useSkills]::ERROR FETCHING', new Error(error))
      })
  }, [])

  React.useEffect(() => {
    if (!collection) return
    console.debug('[useSkills]::Fetching freshest skills metadata')
    _fetchNewestCollectionSkills(collection)
      .then((res = []) => setSkills(res))
      .catch((error) => {
        console.error('[useSkills]::ERROR FETCHING', new Error(error))
      })
  }, [collection])

  return { skills, collection }
}

async function _fetchFreshestCollectionMetadata(): Promise<CollectionMetadata> {
  // TODO: call totalSupply() on PSTLCollections contract
  const totalCollections = await delay(500, 1)
  const freshestID = totalCollections - 1

  // TODO: call tokenUri(freshestID) on PSTLCollections contract using freshestID
  const collectionMetadataUri = await delay(600, `https://ik.imagekit.io/pastelle/SKILLS/COLLECTIONS/${freshestID}`)

  // TODO: fetch actual collection metadata here using <collectionMetadataUri>
  console.debug('[useSkills]::Fetching latest collection @ index', freshestID, ' @ url', collectionMetadataUri)
  const collectionMetadata: CollectionMetadata = await delay(1200, MOCK_COLLECTIONS_DATA[freshestID])

  return collectionMetadata
}

async function _fetchNewestCollectionSkills(
  collectionMetadata: CollectionMetadata
): Promise<SkillMetadata[] | undefined> {
  const totalSkills = collectionMetadata?.properties?.skills
  if (!totalSkills) return undefined

  const mockContract = await delay<{ uri(id: number): Promise<string> }>(700, {
    async uri(id: number): Promise<string> {
      console.debug('Fetchihg URI for id', id)
      return 'ipfs://QmPf95AjYdgsTsZ9BcqqabYB4pdFgLoAQhnHN93UbDswio/{id}.json'
    }
  })

  const skillMetadataUriPromises: Promise<string>[] = []
  for (let i = 0; i < totalSkills; i++) {
    skillMetadataUriPromises.push(mockContract.uri(i))
  }

  const metadataUris = (await Promise.all(skillMetadataUriPromises)).map((uri, index) =>
    uri.replace('{id}', index.toString().padStart(64, '0'))
  )
  const metadata: SkillMetadata[] = await Promise.all(
    metadataUris.map(async (uri) => {
      const formattedUri = getHash(uri)
      return await fetch(`${GATEWAY_URI}/${formattedUri}`).then((res) => res.json())
    })
  )

  return metadata
}
