import dotEnv from 'dotenv'
import inquirer from 'inquirer'

import { networksToChainId } from './constants/chains'
import { getConfig } from './utils/getConfig'
import { writeNetworks } from './utils/writeNetworks'

dotEnv.config()

async function writeUpdatedNetworks(): Promise<void> {
  const { networks } = await getConfig()
  // Prompt for user input
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'network',
      message: 'Select a network',
      choices: Object.keys(networks).map((network) => ({ name: network, value: network }))
    },
    {
      type: 'list',
      name: 'contractName',
      message: 'Select a contract for which to make updates:',
      choices: [
        {
          name: 'CollectionsManager',
          value: 'CollectionsManager',
          description: 'CollectionsManager contract'
        }
      ]
    },
    {
      type: 'input',
      name: 'newAddress',
      message: 'Enter CollectionsManager address to update networks.json file with'
    },
    {
      type: 'input',
      name: 'transactionHash',
      message: 'Enter transactionHash of deployed contract or leave blank'
    }
  ])

  const {
    contractName,
    newAddress,
    transactionHash,
    network
  }: {
    contractName: string
    network: string
    newAddress: string
    transactionHash: string | undefined
  } = answers

  const chainId = networks?.[network]?.id || (networksToChainId as Record<string, number>)?.[network]
  if (!chainId) throw new Error('[Forge-CLI] ChainId not found for network ' + network + '. Please check networks.json')

  await writeNetworks({
    // SOL contract name
    contract: contractName,
    // deployed contract addr
    newAddress,
    // deployed txHash
    transactionHash,
    chainId,
    // network string name (e.g mumbai)
    network
  })
}

export default async () =>
  writeUpdatedNetworks()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
