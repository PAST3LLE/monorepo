interface ChainInfo {
  name: string
  chainId: number
  shortName: string
  networkId: number
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export const getAllChainsInfo = async (): Promise<ChainInfo[]> => {
  try {
    const chainInfo = await fetch('https://chainid.network/chains_mini.json')
    if (!chainInfo.ok) {
      throw new Error('[@past3lle/web3-modal::getAllChainsInfo] Error getting chains info, response not ok!')
    }

    return chainInfo.json()
  } catch (error: any) {
    throw new Error('[@past3lle/web3-modal::getAllChainsInfo] Error getting chains info. ' + error?.message)
  }
}

export function getSafeAppChainShortName() {
  if (typeof globalThis?.window === undefined || !window?.top?.location?.search) return undefined

  return new URLSearchParams(window.top.location.search).get('safe')?.split(':')[0]
}

export async function getChainInfoFromShortName(shortName: string) {
  const allChains = await getAllChainsInfo()

  return allChains.find((chain) => chain.shortName === shortName)
}

export async function getSafeAppChainInfo() {
  const shortName = getSafeAppChainShortName()

  if (!shortName) return undefined
  return getChainInfoFromShortName(shortName)
}
