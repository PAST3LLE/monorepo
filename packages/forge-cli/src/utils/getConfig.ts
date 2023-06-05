import { promises as fs } from 'fs'
import path from 'path'

import { ForgeConfig } from '../types/networks'

const DEFAULT_CONFIG: ForgeConfig = {
  networks: {
    goerli: {
      id: 5,
      rpcUrl: 'https://goerli.infura.io/v3/INSERT_INFURA_KEY_HERE'
    },
    mumbai: {
      id: 80001,
      rpcUrl: 'https://rpc-mumbai.maticvigil.com/v1/INSERT_MATIC_VIGIL_KEY_HERE'
    },
    matic: {
      id: 137,
      rpcUrl: 'https://rpc-mainnet.maticvigil.com/v1/INSERT_MATIC_VIGIL_KEY_HERE'
    }
  },
  mnemonic: 'test test test test test',
  etherscanApiKey: 'INSERT_ETHERSCAN_API_KEY_HERE'
}

const CONFIG_PATH = path.join(process.cwd(), '/forge.config.json')
const INDENT = '  '
export async function getConfig() {
  let config = DEFAULT_CONFIG
  try {
    config = JSON.parse(await fs.readFile(CONFIG_PATH, { encoding: 'utf-8' }))
  } catch (error) {
    await fs.writeFile(process.cwd() + '/forge.config.json', JSON.stringify(config, null, INDENT))

    console.log(`

  
    / __ \\/ / / /  / | / / __ \\/ /
   / / / / /_/ /  /  |/ / / / / / 
  / /_/ / __  /  / /|  / /_/ /_/  
  \\____/_/ /_/  /_/ |_/\\____(_)   
                                  
  

  WARNING!
  No "forge.config.json" file found in the current directory root: ${process.cwd()}. 
  We created a default config file for you, but Forge-CLI will now close! 
  Please update it with your own values and run the CLI again.

    `)

    process.exit(1)
  }

  if (!config?.networks) {
    throw new Error(
      '[Forge-CLI] No networks detected. Check that your networks object inside forge.config.json is correct.'
    )
  }
  if (!config?.mnemonic) {
    throw new Error(
      '[Forge-CLI] No networks detected. Check that your mnemonic string inside forge.config.json is correct.'
    )
  }

  return {
    networks: config.networks,
    mnemonic: config.mnemonic,
    etherscanApiKey: config.etherscanApiKey
  }
}
