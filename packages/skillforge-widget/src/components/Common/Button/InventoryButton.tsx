import { ButtonProps } from '@past3lle/components'
import { useForgeWindowSizeAtom } from '@past3lle/forge-web3'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import React from 'react'

import { ThemedButton } from '.'
import { useSidePanelWriteAtom } from '../../../state/SidePanel'
import { MAIN_BG, MAIN_FG } from '../../../theme/constants'
import { useGenericImageSrcSet } from '../../../theme/global'
import { useAssetsMap } from '../../../theme/utils'
import { CursiveMonoHeader, CursiveMonoHeaderProps, MonospaceText } from '../Text'

interface InventoryButtonProps {
  buttonProps?: ButtonProps
  capitalLetterProps?: CursiveMonoHeaderProps['capitalLetterProps']
  restWordProps?: CursiveMonoHeaderProps['restWordProps']
}
export function InventoryButton(props: InventoryButtonProps) {
  const [, openActivePanel] = useSidePanelWriteAtom()
  const assetsMap = useAssetsMap()
  const logoUrlMaps = useGenericImageSrcSet()

  const [{ width = 0 }] = useForgeWindowSizeAtom()
  const showShortLogo = width > MEDIA_WIDTHS.upToSmall && width < MEDIA_WIDTHS.upToMedium

  return (
    <ThemedButton
      bgColor={'black'}
      bgImage={logoUrlMaps.EMPTY_SKILL_DDPX_URL_MAP ?? undefined}
      bgBlendMode="hard-light"
      title={'Click to view skills inventory and account information'}
      display="flex"
      flexDirection={width > MEDIA_WIDTHS.upToSmall ? 'row' : 'row-reverse'}
      alignItems="center"
      gap="0 0.5rem"
      height="80%"
      {...props.buttonProps}
      onClick={() => openActivePanel('USER_STATS')}
    >
      {width > MEDIA_WIDTHS.upToSmall ? (
        <CursiveMonoHeader
          text={showShortLogo ? 'Items' : 'Inventory'}
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
            margin: '0 0 0.2rem -0.4rem',
            color: '#ebebe9e3',
            fontFamily: 'monospace',
            fontSize: '1.8rem',
            letterSpacing: '-1.4px',
            fontStyle: 'normal',
            fontWeight: 300,
            ...props.restWordProps
          }}
        />
      ) : (
        <MonospaceText color={MAIN_FG} fontSize="1.05rem" marginLeft="-0.2rem">
          items
        </MonospaceText>
      )}
      <img src={assetsMap.icons.inventory} style={{ maxWidth: width > MEDIA_WIDTHS.upToSmall ? '2.3rem' : '2.8rem' }} />
    </ThemedButton>
  )
}
