import { SkillForgeContractAddressMap } from '../types'

export type CommonHooksProps<M extends SkillForgeContractAddressMap> = { collectionId: number; addressMap: M }
