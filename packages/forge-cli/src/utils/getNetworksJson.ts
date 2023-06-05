import { promises as fs } from 'fs'
import path from 'path'

import { NetworksJson } from '../types/networks'

const NETWORKS_PATH = path.join(process.cwd(), '/networks.json')
export async function getNetworksJson() {
  let networks: NetworksJson = {}
  try {
    networks = JSON.parse(await fs.readFile(NETWORKS_PATH, { encoding: 'utf-8' }))
  } catch (error) {
    console.error('[Forge-CLI] Error reading networks.json file. Creating new file networks.json at root.')
    networks = {}
  }

  return networks
}
