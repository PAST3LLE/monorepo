import { GATEWAY_URI } from '../constants/ipfs'

export const getHash = (uri: string) => (uri.startsWith('ipfs://') ? uri.substring(7) : uri)
export function ipfsToImageUri(uriHash: string, gateway: string = GATEWAY_URI) {
  const skillUriHash = getHash(uriHash)

  return `${gateway}/${skillUriHash}`
}
