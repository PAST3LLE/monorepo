import { useForgeMetadataMapReadAtom } from '@past3lle/forge-web3'

import { useActiveSkillReadAtom } from '../state/Skills'

export function useGetActiveSkillFromActiveSkillId() {
  const [[activeSkillId]] = useActiveSkillReadAtom()
  const [metadataMap] = useForgeMetadataMapReadAtom()

  return metadataMap[activeSkillId]
}
