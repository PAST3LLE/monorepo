import { promises as fs } from 'fs'
import path from 'path'

import { DEFAULT_NETWORKS_SUB_PATH, INDENT } from '../constants/paths'
// eslint-disable-next-line import/order
import { ContractNames } from '../types/networks'
import { getNetworksJson } from './getNetworksJson'

interface WriteNetworksArgs {
  contract: ContractNames
  newAddress: string
  transactionHash?: string
  chainId: number
  network: string
  customSubPath?: string
}

export async function writeNetworks({
  contract,
  newAddress,
  transactionHash,
  chainId,
  network,
  customSubPath
}: WriteNetworksArgs) {
  try {
    if (network === 'localhost') {
      console.log('[Forge-CLI] Localhost network detected, bailing.')
      return
    }

    const networks = await getNetworksJson()

    const updatedNetworks = {
      ...(networks || {}),
      [chainId]: {
        ...(networks?.[chainId] || {}),
        [contract]: {
          ...(networks?.[chainId]?.[contract] || {}),
          timestamp: new Date().toISOString(),
          address: newAddress,
          transactionHash: transactionHash || networks?.[chainId]?.[contract]?.transactionHash || ''
        }
      }
    }

    const writePath = path.join(process.cwd(), customSubPath || DEFAULT_NETWORKS_SUB_PATH, 'forge-networks.json')
    console.log(
      '[Forge-CLI] New forge network information to write:',
      JSON.stringify(updatedNetworks, null, INDENT),
      ' Attempting to write at:',
      writePath
    )

    await fs.writeFile(writePath, JSON.stringify(updatedNetworks, null, INDENT))
    console.log('[Forge-CLI] Succesfully wrote new address to', writePath)
  } catch (error) {
    console.error(error)
  }
}
