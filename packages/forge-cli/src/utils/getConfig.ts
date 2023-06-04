// import { promises as fs } from 'fs'
// import path from 'path'

export async function getConfig() {
  const config = await import(process.cwd() + '/forge.config.js')

  if (!config.networks) {
    throw new Error('No networks detected. Check that your networks object inside forge.config is correct.')
  }
  if (!config.mnemonic) {
    throw new Error('No networks detected. Check that your mnemonic string inside forge.config is correct.')
  }

  return {
    networks: config.networks,
    mnemonic: config.mnemonic,
    etherscanApiKey: config.etherscanApiKey
  }
}
