import { ChainsPartialReadonly, ForgeW3AppConfig, SupportedForgeChains } from '@past3lle/forge-web3'
// import { isIframe } from '@past3lle/wagmi-connectors'
import {
  ReactNode,
  /* useEffect, */
  useMemo
} from 'react'

import { SkillForgeProps } from '../components'
import { SkillForgeConnectedDataProviders, SkillForgeDisconnectedDataProviders } from '../state'
import { SkillForgeThemeByModes } from '../theme/types'

type Provider = ({
  children,
  ...props
}: ForgeW3AppConfig & {
  theme: SkillForgeThemeByModes<ChainsPartialReadonly<SupportedForgeChains>>
  children: ReactNode
}) => JSX.Element

export function useConfigMiddleware(config: SkillForgeProps['config']): [Provider, SkillForgeProps['config']] {
  const Provider = useMemo(
    () => (config.web3.standalone ? SkillForgeDisconnectedDataProviders : SkillForgeConnectedDataProviders),
    [config.web3.standalone]
  )

  /*
  const [modifiedConfig , setModdedConfig] = useState(config)
  useEffect(() => {
    // Not an iFrame dapp. This takes no effect.
    if (!isIframe()) return

    setModdedConfig({ ...config, web3: { ...config.web3, chains: [polygon] } })
  }, [config])
  */

  return [Provider, config]
}
