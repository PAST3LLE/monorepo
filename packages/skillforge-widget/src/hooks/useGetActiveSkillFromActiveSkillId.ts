import { SupportedForgeChainIds, useForgeMetadataMapReadAtom } from '@past3lle/forge-web3'

import { useActiveSkillReadAtom } from '../state/Skills'

export function useGetActiveSkillFromActiveSkillId(chainId: SupportedForgeChainIds | undefined) {
  const [[activeSkillId]] = useActiveSkillReadAtom()
  const [metadataMap] = useForgeMetadataMapReadAtom(chainId)

  return metadataMap[activeSkillId]
}
