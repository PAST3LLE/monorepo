import { promises as fs } from 'fs'
import path from 'path'

import { NetworksJson } from '../types/networks'

const NETWORKS_PATH_ROOT = path.join(process.cwd(), '/forge-networks.json')
const NETWORKS_PATH_SRC = path.join(process.cwd(), '/src/forge-networks.json')
export async function getNetworksJson() {
  let networks: NetworksJson = {}
  try {
    const [root, src] = await Promise.allSettled([
      fs.readFile(NETWORKS_PATH_ROOT, { encoding: 'utf-8' }),
      fs.readFile(NETWORKS_PATH_SRC, { encoding: 'utf-8' })
    ])
    if (root.status === 'fulfilled') {
      networks = JSON.parse(root.value)
    } else if (src.status === 'fulfilled') {
      networks = JSON.parse(src.value)
    } else {
      throw new Error('[Forge-CLI] No forge-networks.json file found in either root or src directory.')
    }
  } catch (error) {
    console.error('[Forge-CLI] Error reading forge-networks.json file. Creating new file forge-networks.json at root.')
    networks = {}
  }

  return networks
}
