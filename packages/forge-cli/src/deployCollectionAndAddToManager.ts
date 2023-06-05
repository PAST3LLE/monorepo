/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Collection__factory as Collection,
  CollectionsManager__factory as CollectionsManager
} from '@past3lle/skilltree-contracts'
import { ethers } from 'ethers'
import inquirer from 'inquirer'

import { networksToChainId } from './constants/chains'
import { ContractNames, SupportedNetworks } from './types/networks'
import { getConfig } from './utils/getConfig'
import { getNetworksJson } from './utils/getNetworksJson'
import { getWalletInfo } from './utils/getWalletInfo'
import { writeNetworks } from './utils/writeNetworks'

async function deployCollectionAndAddToManager(): Promise<void> {
  const { networks: networksMap, mnemonic: configMnemonic } = await getConfig()

  if (!networksMap) {
    throw new Error(
      '[Forge-CLI] No networks map detected. Check script signature if passing via function call otherwise .env NETWORKS_URL_MAP'
    )
  }

  // Prompt for user input
  const networkAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'network',
      message: 'Select a network',
      choices: Object.keys(networksMap).map((network) => ({ name: network, value: network }))
    }
  ])

  const network = networkAnswer.network as SupportedNetworks
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
    No CollectionsManager networks.json information found! 
    
    Either deploy a new CollectionsManager via the CLI > deployCollectionsManager
    
    OR
    
    Write new networks using an existing address via the CLI > writeNetworks

    Exiting CLI.

    `)
    process.exit(0)
  }

  const answers = await inquirer.prompt([
    {
      type: 'password',
      name: 'mnemonic',
      message: 'Enter mnemonic phrase or leave empty if you want to use the forge.config value:'
    },
    {
      type: 'input',
      name: 'metadataUri',
      message: `Enter your Collection metadata folder uri -
      
  Example: ipfs://someHash/
        
  NOTE: Using IPFS urls (ipfs://) are recommended as it provides an immutable url.

  URL must point to an IPFS folder containing each collection's skills metadata information.
  It MUST also end with a trailing slash, like in the examples above.

Metadata URI:`,
      validate(input) {
        if (typeof input === 'string' && input.length > 0 && input.startsWith('ipfs://') && input.endsWith('/')) {
          return true
        }

        throw Error('Please provide a valid metadata uri.')
      }
    },
    {
      type: 'input',
      name: 'collectionName',
      message: 'Enter your Collection name',
      validate(input) {
        if (typeof input === 'string' && input.length > 0) {
          return true
        }

        throw Error('Please provide a valid collection name.')
      }
    }
  ])

  const { mnemonic: cliMnemonic, metadataUri, collectionName } = answers

  const mnemonic: string | undefined = cliMnemonic || configMnemonic
  if (!mnemonic) {
    throw new Error('[Forge-CLI] No mnemonic detected. Check forge.config or CLI params if using them.')
  }

  const rpcUrl = networksMap?.[network].rpcUrl
  const chainId = networksMap?.[network].id
  if (!rpcUrl)
    throw new Error(
      '[Forge-CLI] No rpcUrl found for network ' + network + '. Please check forge.config networks settings'
    )
  if (!chainId)
    throw new Error(
      '[Forge-CLI] No chainId found for network ' + network + '. Please check forge.config networks settings'
    )
  const { wallet, provider } = getWalletInfo({ rpcUrl, mnemonic })

  console.log(`
      
  Configuration submitted. Deploying Collection.sol to ${network} with the following parameters:
  
  MNEMONIC: ******
  RPC URL: ${rpcUrl}
  
  METADATA URI: ${metadataUri}
  NAME: ${collectionName}
  COLLECTIONS MANAGER ADDRESS: ${collectionsManagerAddr}

  Please wait...

  `)

  // Get Collection contract instance
  const CollectionsManagerContract = new ethers.Contract(collectionsManagerAddr, CollectionsManager.abi, wallet)

  // Load the contract's bytecode and ABI
  const collectionAbi = Collection.abi
  const collection = Collection.bytecode

  const factory = new ethers.ContractFactory(collectionAbi, collection, wallet)

  const constructorArgs = [metadataUri, collectionName, collectionsManagerAddr]
  // // Deploy the contract
  const collectionContract = await factory.deploy(...constructorArgs)

  // // Wait for the deployment transaction to be mined
  await collectionContract.deployed()
  console.log('[Forge-CLI] Collection.sol contract deployed at address:', collectionContract.address)

  const collectionsManager = CollectionsManagerContract.attach(collectionsManagerAddr)
  // Add a new collection to CollectionsManager
  await collectionsManager.addCollection(collectionContract.address)
  const collectionId: number = (await collectionsManager.totalSupply()).toNumber()
  console.log(
    '[Forge-CLI] Added new collection into CollectionsManager.sol! Collections.sol address:',
    collectionContract.address,
    ' With ID inside CollectionsManager:',
    collectionId
  )

  await writeNetworks({
    // SOL contract name
    contract: ('Collection-' + (collectionId + 1)) as ContractNames,
    // deployed contract addr
    newAddress: collectionContract.address,
    // deployed txHash
    transactionHash: collectionContract.deployTransaction.hash,
    chainId: provider.network.chainId,
    // network string name (e.g mumbai)
    network: provider.network.name
  })
}

export default async () =>
  deployCollectionAndAddToManager()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
