const BLOCK_EXPLORER_PREFIXES: { [chainId: number]: string } = {
  1: 'etherscan.io',
  5: 'goerli.etherscan.io',
  137: 'polygonscan.com',
  80001: 'mumbai.polygonscan.com'
}

export function getBlockExplorerURL(
  chainId: number | undefined,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string | undefined {
  if (!chainId) return undefined
  const prefix = `https://${BLOCK_EXPLORER_PREFIXES[chainId]}`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}
