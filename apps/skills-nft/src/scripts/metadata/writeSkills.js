import fs from 'fs'

import metadataToWrite from '../../skills/metadata.js'
import { extractArgs } from '../../utils.js'

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
  console.log('ALL ARGS', args)

  if (!collectionId || Number(collectionId) === undefined || isNaN(collectionId))
    throw new Error(
      'writeSkills.js script requires a collection id! Check your passed node args. e.g yarn writeSkills <collection_id>'
    )

  try {
    metadataToWrite.forEach(async (collection, i) => {
      const folderIndex = (i + 1).toString()
      const folderPath = 'apps/skills-nft/src/skills/' + folderIndex + '/metadata'
      const folderExists = fs.existsSync(folderPath)

      if (!folderExists) {
        console.log('Folder at path', folderPath, " doesn't exist yet, making...")
        // folder name relative to root (monorepo)
        await fs.promises.mkdir(folderPath).catch((error) => {
          console.error(error)
        })
      } else {
        console.log(`Folder ${folderIndex} already exists, skipping creation...`)
      }
      return collection.map((metadata, index) =>
        fs.promises.writeFile(
          `${folderPath}/${((index + 1) * 1000).toString()}.json`,
          JSON.stringify(metadata, null, ' ')
        )
      )
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
