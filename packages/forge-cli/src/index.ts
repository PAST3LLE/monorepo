#!/usr/bin/env node
import inquirer from 'inquirer'

import deployCollectionAndAddToManager from './deployCollectionAndAddToManager'
import deployCollectionsManager from './deployCollectionsManager'
import mintCollectionSkills from './mintCollectionSkills'
import writeUpdatedNetworks from './writeUpdatedNetworks'

async function cli() {
  // Prompt for user input
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'task',
      message: `
  Welcome to Past3lle's
  
  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄       ▄▄▄▄▄▄▄▄▄▄▄  ▄            ▄▄▄▄▄▄▄▄▄▄▄ 
 ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░░░░░░░░░░░▌▐░▌          ▐░░░░░░░░░░░▌
 ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀      ▐░█▀▀▀▀▀▀▀▀▀ ▐░▌           ▀▀▀▀█░█▀▀▀▀ 
 ▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌          ▐░▌               ▐░▌          ▐░▌               ▐░▌     
 ▐░█▄▄▄▄▄▄▄▄▄ ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌ ▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄      ▐░▌          ▐░▌               ▐░▌     
 ▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌▐░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░▌          ▐░▌               ▐░▌     
 ▐░█▀▀▀▀▀▀▀▀▀ ▐░▌       ▐░▌▐░█▀▀▀▀█░█▀▀ ▐░▌ ▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀      ▐░▌          ▐░▌               ▐░▌     
 ▐░▌          ▐░▌       ▐░▌▐░▌     ▐░▌  ▐░▌       ▐░▌▐░▌               ▐░▌          ▐░▌               ▐░▌     
 ▐░▌          ▐░█▄▄▄▄▄▄▄█░▌▐░▌      ▐░▌ ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄      ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄  ▄▄▄▄█░█▄▄▄▄ 
 ▐░▌          ▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
  ▀            ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀       ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀ 
  
  
  Past3lle's FORGE-CLI is a tool for deploying and managing your Forge-powered Skill (NFT) collections.

  What would you like to do?`,
      choices: [
        new inquirer.Separator(' '),
        {
          name: 'a) Deploy a new CollectionsManager contract',
          value: 'deployCollectionsManager',
          description: 'Deploys a CollectionsManager contract to the specified network'
        },
        new inquirer.Separator(' '),
        {
          name: 'b) Deploy and add a new Collection to your CollectionsManager contract',
          value: 'deployCollectionAndAddToManager',
          description: 'Creates (deploys) a collection and adds it to the CollectionsManager contract'
        },
        new inquirer.Separator(' '),
        {
          name: 'c) Mint new locked and unlocked SKILLS to a deployed collection',
          value: 'mintCollectionSkills',
          description: 'Mints new locked and/or unlocked SKILLS to a deployed collection'
        },
        new inquirer.Separator(' '),
        {
          name: 'd) Update root forge-networks.json file with a new CollectionsManager contract address',
          value: 'writeNetworks',
          description: 'Update forge-networks.json with new CollectionsManager.sol address'
        }
      ]
    }
  ])

  const { task } = answers
  switch (task) {
    case 'deployCollectionsManager':
      await deployCollectionsManager()
      break
    case 'deployCollectionAndAddToManager':
      await deployCollectionAndAddToManager()
      break
    case 'mintCollectionSkills':
      await mintCollectionSkills()
      break
    case 'writeNetworks':
      await writeUpdatedNetworks()
      break
    default:
      console.log('No task selected')
      throw new Error('[Forge-CLI] No task selected')
  }
}

export default cli()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
