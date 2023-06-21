import { delay, devDebug, devError } from '@past3lle/utils'

import { DEFAULT_GATEWAY_URI } from '../constants/ipfs'
import { MetadataFetchOptions } from '../state/Metadata/updaters/MetadataUpdater'

export const getHash = (uri: string) => (uri.startsWith('ipfs://') ? uri.substring(7) : uri)
export function ipfsToImageUri(uriHash: string, gateway: string = DEFAULT_GATEWAY_URI) {
  const skillUriHash = getHash(uriHash)

  return `${gateway}/ipfs/${skillUriHash}`
}

export function ipfsToLsUri(uriHash: string, gateway: string = DEFAULT_GATEWAY_URI) {
  const skillUriHash = getHash(uriHash)

  return `${gateway}/api/v0/ls?arg=${skillUriHash}`
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
  const controllersMap: Map<number, AbortController> = new Map()

  const gateways = customGateways?.length ? customGateways : [{ gateway: DEFAULT_GATEWAY_URI }]

  let success
  for (let i = 0; i < gateways.length; i++) {
    const { gateway: uri, config } = gateways[i]

    const controller = new AbortController()
    controllersMap.set(i, controller)
    const { signal } = controller

    try {
      const ipfsUri = ipfsToImageUri(uriHash, uri)
      const response = await fetch(ipfsUri, { ...config?.init, signal })

      if (!response?.ok) {
        controller.abort()
        devError('Fetching', uri, 'failed. Controller.abort() called. Trying next...')
      } else {
        devDebug('Gateway URI fetch at index', i, 'succesful. Aborting all other requests.')
        controllersMap.delete(i)
        controllersMap.forEach((controller) => controller.abort())

        success = response
        break
      }
    } catch (error) {
      controller.abort()
      devError('Fetching', uri, 'failed. Controller.abort() called. Trying next...')
    }
  }
  return success
}

export async function chainFetchIpfsLsUri(uriHash: string, ...customGateways: CustomIpfsGatewayConfig[]) {
  const gateways = customGateways?.length ? customGateways : [{ gateway: DEFAULT_GATEWAY_URI }]

  let success
  for (let i = 0; i < gateways.length; i++) {
    const { gateway: uri, config } = gateways[i]
    try {
      const ipfsUri = ipfsToLsUri(uriHash, uri)
      const response = await fetch(ipfsUri, config?.init)

      if (!response?.ok) {
        await delay(7500)
        devError('Fetching', uri, 'failed. Trying next...')
      } else {
        success = response
        break
      }
    } catch (error) {
      await delay(7500)
      devError('Fetching', uri, 'failed. Trying next...')
    }
  }
  return success
}

export async function chainFetchIpfsUriBlob(uriHash: string, ...customGateways: CustomIpfsGatewayConfig[]) {
  const gateways = customGateways?.length ? customGateways : [{ gateway: DEFAULT_GATEWAY_URI }]
  const response = await chainFetchIpfsUri(uriHash, ...gateways)

  return response && URL.createObjectURL(await response.blob())
}

type IpfsApiObject = {
  Hash: string
  Name: string
  Size: number
  Target: string
  Type: number
}

export async function chainFetchIpfsApiContent<T extends string>(
  uri: T,
  { fetchOptions, auxData }: { fetchOptions?: MetadataFetchOptions; auxData?: any }
): Promise<{ uri: T; auxData: any }[]> {
  const gateways = fetchOptions?.gatewayApiUris?.length
    ? fetchOptions?.gatewayApiUris
    : [{ gateway: DEFAULT_GATEWAY_URI }]
  return chainFetchIpfsLsUri(uri, ...gateways)
    .then((res) => res?.json())
    .then(
      (res) =>
        res?.Objects?.[0]?.Links?.map((obj: IpfsApiObject) => ({
          uri: uri + '/' + obj.Name,
          auxData
        })) || []
    )
    .catch((error) => {
      console.error('Failed to fetch IPFS CID <ls> uri:', error)
    })
}
