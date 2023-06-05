import { promises as fs } from 'fs'
import path from 'path'

interface WriteNetworksArgs {
  contract: string
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

    let networks
    try {
      networks = JSON.parse(await fs.readFile(NETWORKS_PATH, { encoding: 'utf-8' }))
    } catch (error) {
      console.error('[Forge-CLI] Error reading networks.json file. Creating new file networks.json at root.')
      networks = {}
    }

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
