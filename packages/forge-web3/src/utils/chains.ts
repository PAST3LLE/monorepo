import mergeManagerNetworks from '@past3lle/skilltree-contracts/networks.json'

const supportedChainIds = Object.keys(mergeManagerNetworks).map(Number)

export function isSupportedChain(chainId?: number) {
  if (!chainId) return false
  return supportedChainIds.includes(chainId)
}
