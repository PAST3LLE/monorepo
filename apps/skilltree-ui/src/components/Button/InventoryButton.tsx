import { ThemedButton } from '.'
import { ButtonProps } from '@past3lle/components'
import { CursiveMonoHeaderProps, CursiveMonoHeader } from 'components/Text'
import React from 'react'
import { useSidePanelAtom } from 'state/SidePanel'

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
          color: '#77c51b',
          fontSize: '3rem',
          zIndex: 3,
          ...props.capitalLetterProps
        }}
        restWordProps={{
          color: '#ebebe9',
          fontSize: '2rem',
          fontWeight: 300,
          zIndex: -1,
          marginLeft: '-0.2rem',
          ...props.restWordProps
        }}
      />
    </ThemedButton>
  )
}
