import { goerli, polygon, polygonMumbai } from 'viem/chains'

export type CosmosSupportedChainIds = 1 | 5 | 137 | 80001
export const chains = [goerli, polygon, polygonMumbai] as const
