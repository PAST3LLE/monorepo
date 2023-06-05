/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Collection__factory as Collection,
  CollectionsManager__factory as CollectionsManager
} from '@past3lle/skilltree-contracts'
import networks from '@past3lle/skilltree-contracts/networks.json'
import { ethers } from 'ethers'
import inquirer from 'inquirer'

import { getConfig } from './utils/getConfig'
import { getWalletInfo } from './utils/getWalletInfo'
import { writeNetworks } from './utils/writeNetworks'

async function mintAndAddCollectionToManager(): Promise<void> {
  const { networks: networksMap, mnemonic: configMnemonic } = await getConfig()

  if (!networksMap) {
    throw new Error(
      '[Forge-CLI] No networks map detected. Check script signature if passing via function call otherwise .env NETWORKS_URL_MAP'
    )
  }

  // Prompt for user input
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'network',
      message: 'Select a network',
      choices: Object.keys(networksMap).map((network) => ({ name: network, value: network }))
    },
    {
      type: 'password',
      name: 'mnemonic',
      message: 'Enter mnemonic phrase or leave empty if you want to use the forge.config value:'
    }
  ])

  const { network, mnemonic: cliMnemonic } = answers
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

  // Get/deploy contracts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collectionsManagerAddress = (networks as any)?.[chainId.toString()].CollectionsManager.address
  console.log('[Forge-CLI] Using CollectionManager contract deployed at:', collectionsManagerAddress)

  // Get Collection contract instance
  const CollectionsManagerContract = new ethers.Contract(collectionsManagerAddress, CollectionsManager.abi, wallet)

  // Load the contract's bytecode and ABI
  const collectionAbi = Collection.abi
  const collection = Collection.bytecode

  const factory = new ethers.ContractFactory(collectionAbi, collection, wallet)

  // // Deploy the contract
  const collectionContract = await factory.deploy()

  // // Wait for the deployment transaction to be mined
  await collectionContract.deployed()
  console.log('[Forge-CLI] Collection.sol contract deployed at address:', collectionContract.address)

  const collectionsManager = CollectionsManagerContract.attach(collectionsManagerAddress)
  // Add a new collection to CollectionsManager
  await collectionsManager.addCollection(collectionContract.address)
  console.log(
    '[Forge-CLI] Added new collection into CollectionsManager.sol! Collections.sol address:',
    collectionContract.address
  )

  await writeNetworks({
    // SOL contract name
    contract: 'Collection',
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
  mintAndAddCollectionToManager()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
