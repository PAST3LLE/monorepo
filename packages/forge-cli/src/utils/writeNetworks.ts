import { promises as fs } from 'fs'
import path from 'path'

// eslint-disable-next-line import/order
import { ContractNames } from '../types/networks'
import { getNetworksJson } from './getNetworksJson'

interface WriteNetworksArgs {
  contract: ContractNames
  newAddress: string
  transactionHash?: string
  chainId: number
  network: string
}

const NETWORKS_PATH = path.join(process.cwd(), '/networks.json')
const INDENT = '  '
export async function writeNetworks({ contract, newAddress, transactionHash, chainId, network }: WriteNetworksArgs) {
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

    console.log('[Forge-CLI] New network information to write:', JSON.stringify(updatedNetworks, null, INDENT))

    await fs.writeFile(NETWORKS_PATH, JSON.stringify(updatedNetworks, null, INDENT))
    console.log('[Forge-CLI] Succesfully wrote new address to root:networks.json!')
  } catch (error) {
    console.error(error)
  }
}
