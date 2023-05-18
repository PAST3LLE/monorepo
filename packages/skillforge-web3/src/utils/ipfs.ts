import { devError } from '@past3lle/utils'

import { DEFAULT_GATEWAY_URI } from '../constants/ipfs'

export const getHash = (uri: string) => (uri.startsWith('ipfs://') ? uri.substring(7) : uri)
export function ipfsToImageUri(uriHash: string, gateway: string = DEFAULT_GATEWAY_URI) {
  const skillUriHash = getHash(uriHash)

  return `${gateway}/${skillUriHash}`
}
export async function fetchIpfsUriBlob(uriHash: string, gateway = DEFAULT_GATEWAY_URI) {
  const uri = ipfsToImageUri(uriHash, gateway)

  return fetch(uri).then((res) => res.blob())
}

export interface CustomIpfsGatewayConfig {
  gateway: string
  config?: {
    init?: RequestInit
  }
}
export async function chainFetchIpfsUri(uriHash: string, ...customGateways: CustomIpfsGatewayConfig[]) {
  let success
  for (let i = 0; i < customGateways.length; i++) {
    const { gateway: uri, config } = customGateways[i]
    try {
      const ipfsUri = ipfsToImageUri(uriHash, uri)
      const response = await fetch(ipfsUri, config?.init)

      if (!response?.ok) {
        devError('Fetching', uri, 'failed. Trying next...')
      } else {
        success = response
        break
      }
    } catch (error) {
      devError('Fetching', uri, 'failed. Trying next...')
    }
  }
  return success
}

export async function chainFetchIpfsUriBlob(uriHash: string, ...customGateways: CustomIpfsGatewayConfig[]) {
  const response = await chainFetchIpfsUri(uriHash, ...customGateways)

  return response && URL.createObjectURL(await response.blob())
}
