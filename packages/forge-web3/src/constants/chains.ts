import { Chain, goerli, polygon, polygonMumbai } from 'viem/chains'

export const FORGE_SUPPORTED_CHAINS = [goerli, polygon, polygonMumbai] as const satisfies readonly Chain[]
