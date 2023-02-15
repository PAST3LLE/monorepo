import fs from 'fs'
import { createRequire } from 'node:module'

import { extractArgs } from '../../utils.js'

const require = createRequire(import.meta.url)

const metadataToWrite = require('../../skills/metadata.json')

// ============================
// ========== Flags ===========
// ============================
// --collectionId: number
// --overwrite: boolean
// ============================
// ============================

const args = extractArgs(process.argv)
async function writeSkills() {
  const { collectionId, overwrite } = args

  console.log('COLLECTION ID', collectionId)
  console.log('OVERWRITE?', overwrite)

  if (collectionId && (Number(collectionId) === undefined || isNaN(collectionId)))
    throw new Error(
      'writeSkills.js script requires a type NUMBER collection id! Check your passed node args. e.g yarn writeSkills <collection_id>'
    )

  try {
    metadataToWrite.forEach(async (collection, collectionIdx) => {
      const folderIndex = (collectionIdx + 1).toString()
      const folderPath = './src/skills/' + folderIndex + '/metadata'
      const folderExists = fs.existsSync(folderPath)

      if (!folderExists || overwrite) {
        console.log(
          !folderExists
            ? folderPath + " doesn't exist yet, making..."
            : overwrite
            ? 'Overwrite flag passed - overwriting folder in place.'
            : ''
        )
        // folder name relative to root (monorepo)
        await fs.promises.mkdir(folderPath, { recursive: true }).catch((error) => {
          console.error(error)
        })
      } else {
        console.log(`Folder ${folderIndex} already exists, skipping creation...`)
      }
      return collection.map((metadata) => {
        // checks properties are there, errors and bails if not
        _checkSkillMetadataSchema(metadata)
        const id = metadata.properties.id.split('-')[1]
        console.log('SKILL ID', id)
        // e.g 1000 => 0000000000000000000000000000000000000000000000000000000000001000
        const fileName = id.toString().padStart(64, 0)
        return fs.promises.writeFile(`${folderPath}/${fileName}.json`, JSON.stringify(metadata, null, ' '))
      })
    })

    console.log('Succesfully wrote new skills JSON metdata')
  } catch (error) {
    console.error(error)
  }
}

writeSkills().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

function _checkSkillMetadataSchema(rawMetadata) {
  if (
    // props exist
    !!rawMetadata.description &&
    !!rawMetadata.image &&
    !!rawMetadata.name &&
    !!rawMetadata.properties &&
    !!rawMetadata.properties.shopifyId &&
    !!rawMetadata.properties.id &&
    _checkSkillMetadataRarityType(rawMetadata.properties.rarity) &&
    Array.isArray(rawMetadata.properties.dependencies) &&
    !!rawMetadata.attributes &&
    !!rawMetadata.attributes.theme &&
    !!rawMetadata.attributes.theme.bg &&
    !!rawMetadata.attributes.theme.altBg &&
    !!rawMetadata.attributes.theme.color &&
    !!rawMetadata.attributes.tags &&
    Array.isArray(rawMetadata.attributes.tags) &&
    // props are right type
    typeof rawMetadata.description === 'string' &&
    typeof rawMetadata.image === 'string' &&
    typeof rawMetadata.name === 'string' &&
    typeof rawMetadata.properties === 'object' &&
    typeof rawMetadata.properties.rarity === 'string' &&
    typeof rawMetadata.properties.shopifyId === 'string' &&
    typeof rawMetadata.properties.id === 'string' &&
    typeof rawMetadata.attributes === 'object' &&
    typeof rawMetadata.attributes.theme === 'object' &&
    typeof rawMetadata.attributes.theme.bg === 'string' &&
    typeof rawMetadata.attributes.theme.altBg === 'string' &&
    typeof rawMetadata.attributes.theme.color === 'string'
  ) {
    return true
  } else {
    throw new Error('INVALID SKILLS METADATA SCHEMA!')
  }
}

function _checkSkillMetadataRarityType(rarity) {
  if (rarity === 'common' || rarity === 'rare' || rarity === 'legendary' || rarity === 'epic') {
    return true
  } else {
    throw new Error('INVALID SKILLS RARITY METADATA PROPERTY!')
  }
}
