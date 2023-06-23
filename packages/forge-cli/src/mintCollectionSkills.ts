/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CollectionsManager__factory as CollectionsManager } from '@past3lle/skilltree-contracts'
import mergeManagerNetworks from '@past3lle/skilltree-contracts/networks.json'
import { ethers } from 'ethers'
import inquirer from 'inquirer'

import { networksToChainId } from './constants/chains'
import { SupportedNetworks } from './types/networks'
import { getConfig } from './utils/getConfig'
import { getFeeData } from './utils/getFeeData'
import { getNetworksJson } from './utils/getNetworksJson'
import { getWalletInfo } from './utils/getWalletInfo'
import { logFormattedTxInfo } from './utils/logFormattedTxInfo'

interface LockedSkillParams {
  amount: number
  id: number
  holdDependencies: { token: string; id: string }[]
  burnDependencies: { token: string; id: string }[]
}

async function mintCollectionSkills(props?: { tryHigherValues?: boolean }): Promise<void> {
  const { networks: networksMap, mnemonic: configMnemonic } = await getConfig()

  if (!networksMap) {
    throw new Error(
      '[Forge-CLI] No networks map detected. Check script signature if passing via function call otherwise .env NETWORKS_URL_MAP'
    )
  }

  // Prompt for user input
  const networkAndMnemonicAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'network',
      message: 'Select a network',
      choices: Object.keys(networksMap).map((network) => ({ name: network, value: network }))
    },
    {
      type: 'input',
      name: 'customSubPath',
      message: `(Optional) Enter a custom sub-path to read/write networks from/to -
  
  Example: "/json/misc/" would resolve to: "${process.cwd()}/json/misc/forge-networks.json"
  
  Defaults root folder: "${process.cwd()}/forge-networks.json"
  
  Custom sub-path:`,
      default: '',
      validate: (input) => {
        if (input === '' || input === undefined || input === null) return true
        if (!input.startsWith('/')) return 'Custom sub-path must start with a "/"'
        if (!input.endsWith('/')) return 'Custom sub-path must end with a "/"'
        return true
      }
    },
    {
      type: 'password',
      name: 'mnemonic',
      message: 'Enter mnemonic phrase or leave empty if you want to use the forge.config value:'
    }
  ])

  const network = networkAndMnemonicAnswer.network as SupportedNetworks
  const idFromNetworkAnswer = networksToChainId?.[network]
  const networksJson = await getNetworksJson()

  const collectionsManagerAddr = networksJson?.[idFromNetworkAnswer]?.CollectionsManager?.address
  if (!collectionsManagerAddr) {
    console.log(`
    _  _ ___   _   ___  ___   _   _ __  _ 
    | || | __| /_\\ |   \\/ __| | | | | _ \\ |
    | __ | _| / _ \\| |) \\__ \\ | |_| |  _/_|
    |_||_|___/_/ \\_\\___/|___/  \\___/|_| (_)

    WARNING!
    No CollectionsManager forge-networks.json information found! 
    
    Either deploy a new CollectionsManager via the CLI > deployCollectionsManager
    
    OR
    
    Write new networks using an existing address via the CLI > writeNetworks

    Exiting CLI.

    `)
    process.exit(0)
  }

  const unlockedSkillsAnswers = await inquirer.prompt([
    {
      type: 'number',
      name: 'collectionId',
      message: 'For which collection ID are you minting new skills?'
    },
    {
      type: 'input',
      name: 'to',
      message:
        'To which address are you minting new skills? Any locked skills will ignore this param, so if you plan on only minting locked skills, you can just leave blank! Address:',
      default: '',
      validate(input) {
        if (!input || ethers.utils.isAddress(input)) {
          return true
        }

        throw Error('Please provide a valid address or leave blank.')
      }
    },
    {
      type: 'input',
      name: 'unlockedIds',
      message: `Enter number array of ids. These are ids of skills WITHOUT dependencies. To skip, leave field as is and hit ENTER.
      
      Example: [1,2,3]

IDs:`,
      default: '[]',
      validate(input) {
        if (input && JSON.parse(input)) {
          return true
        }

        throw Error('Invalid JSON. Try again. If skipping, be sure field is blank!')
      }
      // transformer(input) {
      //   return JSON.parse(input)
      // }
    }
  ])

  const { unlockedIds: unlockedIdsJSON, collectionId, to } = unlockedSkillsAnswers

  const unlockedIds = JSON.parse(unlockedIdsJSON)
  const unlockedSkills: { amount: number; id: number }[] = []
  if (unlockedIds?.length) {
    const unlockedSkillsAmountAnswers: { amount: number }[] = []
    for (let i = 0; i < unlockedIds.length; i++) {
      const answer = await inquirer.prompt({
        type: 'number',
        name: 'amount',
        message: `How many of skill ${unlockedIds[i]} are you minting?`
      })
      unlockedSkillsAmountAnswers.push(answer)
    }

    unlockedSkillsAmountAnswers.forEach((answer: { amount: number }, i: number) =>
      unlockedSkills.push({ id: unlockedIds[i], amount: answer.amount })
    )
  }

  const lockedSkillsAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'lockedIds',
      message: `Enter number array of ids. These are ids of skills WITH dependencies. To skip, leave field as is and hit ENTER.
      
      Example: [1,2,3]

IDs:`,
      default: '[]',
      validate(input) {
        if (input && JSON.parse(input)) {
          return true
        }

        throw Error('Invalid JSON. Try again.')
      }
      // transformer(input) {
      //   return JSON.parse(input)
      // }
    }
  ])

  const { lockedIds: lockedIdsJSON } = lockedSkillsAnswers

  const lockedIds = lockedIdsJSON && JSON.parse(lockedIdsJSON)
  const lockedSkills: LockedSkillParams[] = []
  if (lockedIds?.length) {
    const lockedSkillsAmountAnswers: (Omit<LockedSkillParams, 'holdDependencies' | 'burnDependencies'> & {
      holdDependencies: string
      burnDependencies: string
    })[] = []
    for (let i = 0; i < lockedIds.length; i++) {
      const answer = await inquirer.prompt([
        { type: 'number', name: 'amount', message: `How many of locked skill ${lockedIds[i]} are you minting?` },
        {
          type: 'input',
          name: 'holdDependencies',
          message: `Enter skill HOLD dependencies. Array of objects:
          
        interface Dep { token: AddressOfEIC1155CollectionContract, id: string }
        Example: [{ token: '0x123', id: '1' }, { token: '0x123', id: '2' }]
    
    Hold dependencies:`,
          default: '[]',
          validate(input) {
            if (JSON.parse(input)) {
              return true
            }

            throw Error('Invalid JSON. Try again.')
          }
        },
        {
          type: 'input',
          name: 'burnDependencies',
          message: `Enter skill BURN dependencies. Array of objects:
          
        interface Dep { token: AddressOfEIC1155CollectionContract, id: string }
        Example: [{ token: '0x123', id: '1' }, { token: '0x123', id: '2' }]
    
        CAUTION: these are dependencies that will be burned when the skill is used!

    Burn dependencies:`,
          default: '[]',
          validate(input) {
            if (JSON.parse(input)) {
              return true
            }

            throw Error('Invalid JSON. Try again.')
          }
        }
      ])
      lockedSkillsAmountAnswers.push(answer)
    }

    lockedSkillsAmountAnswers.forEach(({ amount, holdDependencies, burnDependencies }, i: number) =>
      lockedSkills.push({
        id: lockedIds[i],
        amount,
        holdDependencies: JSON.parse(holdDependencies),
        burnDependencies: JSON.parse(burnDependencies)
      })
    )
  }

  const mnemonic: string | undefined = networkAndMnemonicAnswer?.mnemonic || configMnemonic
  if (!mnemonic) {
    throw new Error('[Forge-CLI] No mnemonic detected. Check forge.config or CLI params if using them.')
  }

  const rpcUrl = networksMap?.[network].rpcUrl
  const chainId = networksMap?.[network].id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergeManagerAddr = (mergeManagerNetworks as any)?.[chainId.toString()]?.MergeManager?.address
  if (!rpcUrl)
    throw new Error(
      '[Forge-CLI] No rpcUrl found for network ' + network + '. Please check forge.config networks settings'
    )
  if (!chainId)
    throw new Error(
      '[Forge-CLI] No chainId found for network ' + network + '. Please check forge.config networks settings'
    )
  if (!mergeManagerAddr)
    throw new Error(
      '[Forge-CLI] No mergeManagerAddr found for network ' +
        network +
        '. Please check networks.json from @past3lle/skilltree-contracts that ' +
        network +
        ' is supported.'
    )
  const { wallet } = getWalletInfo({ rpcUrl, mnemonic })

  console.log(`
      
  Configuration submitted. Mint locked/unlocked skills on ${network} with the following parameters:
  
  MNEMONIC:                   ******
  RPC URL:                    ${rpcUrl}
  
  COLLECTION ID:              ${collectionId}
  TO:                         ${to}
  MERGE MANAGER ADDR:         ${mergeManagerAddr}
  
  UNLOCKED SKILL IDS:         ${unlockedIds.join(', ')}
  UNLOCKED SKILL AMTS:        ${unlockedSkills.map((skill) => skill.amount).join(', ')}

  LOCKED SKILL IDS:           ${lockedIds.join(', ')}
  LOCKED SKILL AMTS:          ${lockedSkills.map((skill) => skill.amount).join(', ')}
  
  LOCKED SKILL HOLD DEPS:     ${lockedSkills
    .map((skill) => skill.holdDependencies.map((dep) => JSON.stringify(dep)).join(', '))
    .join(', ')}
  LOCKED SKILL BURN DEPS:     ${lockedSkills
    .map((skill) => skill.burnDependencies.map((dep) => JSON.stringify(dep)).join(', '))
    .join(', ')}

  Please wait...

  `)

  // Get Collection contract instance
  const CollectionsManagerContract = new ethers.Contract(collectionsManagerAddr, CollectionsManager.abi, wallet)
  const collectionsManager = CollectionsManagerContract.attach(collectionsManagerAddr)

  const feeData = await getFeeData(network, props?.tryHigherValues)

  try {
    if (unlockedIds.length) {
      const txInfo = await collectionsManager
        .mintBatchSkills(
          collectionId,
          to,
          unlockedSkills.map((skill) => skill.id),
          unlockedSkills.map((skill) => skill.amount),
          '0x',
          feeData
        )
        .catch((error: Error | string) => {
          console.error('[Forge-CLI] Error minting unlocked skills: ', error)
          throw new Error(typeof error !== 'string' ? error?.message : error)
        })

      console.log('[Forge-CLI] Minted unlocked skills! Transaction information:', logFormattedTxInfo(txInfo))
    }

    if (lockedSkills.length) {
      const txInfo = await collectionsManager
        .mintBatchLockedSkills(
          collectionId,
          lockedSkills.map((skill) => skill.id),
          lockedSkills.map((skill) => skill.amount),
          '0x',
          mergeManagerAddr,
          lockedSkills.map((skill) => skill.holdDependencies),
          lockedSkills.map((skill) => skill.burnDependencies),
          feeData
        )
        .catch((error: Error | string) => {
          console.error('[Forge-CLI] Error minting locked skills: ', error)
          throw new Error(typeof error !== 'string' ? error?.message : error)
        })

      console.log('[Forge-CLI] Minted locked skills! Transaction info:', logFormattedTxInfo(txInfo))
    }
  } catch (error) {
    console.log(`
    _  _ ___   _   ___  ___   _   _ __  _ 
    | || | __| /_\\ |   \\/ __| | | | | _ \\ |
    | __ | _| / _ \\| |) \\__ \\ | |_| |  _/_|
    |_||_|___/_/ \\_\\___/|___/  \\___/|_| (_)

    ERROR!
    An error occurred while minting new skills! Error message (if any):
    
    ==========================
    ${(error as any)?.message}
    ==========================
    
    Confirm below to try again with higher gas fees as this is likely a network congestion issue.
    `)

    const confirmation = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'retry',
        message: 'Do you wish to retry with 12% higher gas fees?'
      }
    ])

    if (confirmation.retry) {
      console.log('[Forge-CLI] Retrying with 12% increased gas fees.')
      await mintCollectionSkills({ tryHigherValues: true })
    } else {
      throw error
    }
  }

  const confirmation = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: 'Do you wish to mint new skills?'
    }
  ])

  if (!confirmation.continue) {
    console.log('[Forge-CLI] Exiting CLI.')
    process.exit(0)
  }

  await mintCollectionSkills()
}

export default async () =>
  mintCollectionSkills()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
