import type { SupportedForgeNetworks as SupportedForgeChainIds } from '@past3lle/skilltree-contracts'

import { FORGE_SUPPORTED_CHAINS } from '../constants/chains'

type PartialForgeChains = readonly typeof FORGE_SUPPORTED_CHAINS[number][]

export { type SupportedForgeChainIds, type PartialForgeChains }
