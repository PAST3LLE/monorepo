import verify from 'verify-on-etherscan'

import { getConfig } from './getConfig'

interface Params {
  artifact: string
  network: string
}
export async function verifyContract({ artifact, network }: Params) {
  const config = await getConfig()
  const response = await verify({
    cwd: process.cwd(),
    artifacts: [artifact],
    apiKey: config.etherscanApiKey,
    network,
    useFetch: true,
    optimizer: 2000
  })
  console.log('VERIFY RESPONSE', response)
}
