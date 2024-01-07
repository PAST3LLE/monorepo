import { goerli, polygon, polygonMumbai } from 'wagmi/chains'

import { Chain } from '../providers'

export type CosmosSupportedChainIds = 1 | 5 | 137 | 80001
export const chains: Chain<CosmosSupportedChainIds>[] = [goerli, polygon, polygonMumbai]
