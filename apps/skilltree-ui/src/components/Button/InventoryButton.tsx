import { ThemedButton } from '.'
import { ButtonProps } from '@past3lle/components'
import { CursiveMonoHeaderProps, CursiveMonoHeader } from 'components/Text'
import React from 'react'
import { useSidePanelAtom } from 'state/SidePanel'
import { MAIN_BG } from 'theme/constants'

interface InventoryButtonProps {
  buttonProps?: ButtonProps
  capitalLetterProps?: CursiveMonoHeaderProps['capitalLetterProps']
  restWordProps?: CursiveMonoHeaderProps['restWordProps']
}
export function InventoryButton(props: InventoryButtonProps) {
  const [, openActivePanel] = useSidePanelAtom()

  return (
    <ThemedButton
      display="flex"
      alignItems="center"
      gap="0.25rem"
      height="100%"
      withBgImage
      {...props.buttonProps}
      onClick={() => openActivePanel('USER STATS')}
    >
      <CursiveMonoHeader
        text="INVENTORY"
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
          marginLeft: '0rem',
          color: '#ebebe9e3',
          fontFamily: 'aria',
          fontSize: '1.8rem',
          fontStyle: 'normal',
          fontWeight: 100,
          ...props.restWordProps
        }}
      />
    </ThemedButton>
  )
}
