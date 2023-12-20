import { ButtonProps } from '@past3lle/components'
import React from 'react'

import { useSidePanelWriteAtom } from '../../../state/SidePanel'
import { useGenericImageSrcSet } from '../../../theme/global'
import { CursiveMonoHeaderProps } from '../Text'
import { HeaderButton } from './common'

interface InventoryButtonProps {
  buttonProps?: ButtonProps
  capitalLetterProps?: CursiveMonoHeaderProps['capitalLetterProps']
  restWordProps?: CursiveMonoHeaderProps['restWordProps']
}

export function InventoryButton(props: InventoryButtonProps) {
  const [, openActivePanel] = useSidePanelWriteAtom()
  const srcSet = useGenericImageSrcSet()

  return (
    <HeaderButton
      bgImage={srcSet.EMPTY_SKILL_DDPX_URL_MAP}
      fullHeader="View Stash"
      shortHeader="Stash"
      {...props}
      onClick={() => openActivePanel('USER_STATS')}
    />
  )
}
