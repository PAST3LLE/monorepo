import { useEffect } from 'react'
import { ForgeW3CoreProvidersProps } from 'src'

import { useSkillForgeSetSupportedChainsAtom } from '..'

type SkillForgeBalancesProps = Pick<ForgeW3CoreProvidersProps['config']['web3'], 'chains'>
export function SkillForgeUserConfigUpdater({ chains }: SkillForgeBalancesProps) {
  const [, updateUserConfig] = useSkillForgeSetSupportedChainsAtom()
  useEffect(() => {
    updateUserConfig(chains)
  }, [chains])

  return null
}
