import { devError } from '@past3lle/utils'

import { GATEWAY_URI, INFURA_GATEWAY_URI } from '../constants/ipfs'

export const getHash = (uri: string) => (uri.startsWith('ipfs://') ? uri.substring(7) : uri)
export function ipfsToImageUri(uriHash: string, gateway: string = GATEWAY_URI) {
  const skillUriHash = getHash(uriHash)

  return `${gateway}/${skillUriHash}`
}
export async function fetchIpfsUriBlob(uriHash: string, gateway = INFURA_GATEWAY_URI) {
  const uri = ipfsToImageUri(uriHash, gateway)

  return fetch(uri).then((res) => res.blob())
}

export async function chainFetchIpfsUriBlob(uriHash: string, ...customGateways: string[]) {
  let success
  for (let i = 0; i < customGateways.length; i++) {
    const uri = customGateways[i]
    try {
      const ipfsUri = ipfsToImageUri(uriHash, uri)
      const response = await fetch(ipfsUri)

      if (!response?.ok) {
        devError('Fetching', uri, 'failed. Trying next...')
      } else {
        success = URL.createObjectURL(await response.blob())
        break
      }
    } catch (error) {
      devError('Fetching', uri, 'failed. Trying next...')
    }
  }
  return success
}
