import { ThemedButton } from '.'
import { ButtonProps } from '@past3lle/components'
import TREASURE_CHEST_GREEN from 'assets/png/icons/icons8-treasure-chest-90-green.png'
import { CursiveMonoHeaderProps, CursiveMonoHeader } from 'components/Text'
import React from 'react'
import {
  /* useSidePanelAtom, */
  useSidePanelAtomBase
} from 'state/SidePanel'
import { MAIN_BG } from 'theme/constants'

interface InventoryButtonProps {
  buttonProps?: ButtonProps
  capitalLetterProps?: CursiveMonoHeaderProps['capitalLetterProps']
  restWordProps?: CursiveMonoHeaderProps['restWordProps']
}
export function InventoryButton(props: InventoryButtonProps) {
  const [, openActivePanel] = useSidePanelAtomBase()

  return (
    <ThemedButton
      display="flex"
      alignItems="center"
      gap="0.7rem"
      height="100%"
      withBgImage
      {...props.buttonProps}
      onClick={() => openActivePanel((state) => ({ ...state, type: ['USER STATS', ...state.type] }))}
    >
      <CursiveMonoHeader
        text="inventory"
        capitalLetterProps={{
          display: 'inline-flex',
          alignItems: 'center',
          color: MAIN_BG,
          fontSize: '4rem',
          zIndex: 3,
          ...props.capitalLetterProps
        }}
        restWordProps={{
          zIndex: -1,
          marginLeft: '-0.2rem',
          color: '#ebebe9e3',
          fontFamily: 'monospace',
          fontSize: '1.4rem',
          letterSpacing: '-1.4px',
          fontStyle: 'normal',
          fontWeight: 300,
          ...props.restWordProps
        }}
      />
      <img src={TREASURE_CHEST_GREEN} style={{ maxWidth: '2.3rem' }} />
    </ThemedButton>
  )
}
