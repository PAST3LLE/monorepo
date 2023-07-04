import { Row, Text } from '@past3lle/components'
import { useW3AccountNetworkActions, useW3UserConnectionInfo } from '@past3lle/forge-web3'
import { useIsSmallMediaWidth } from '@past3lle/hooks'
import { fromSmall, setBackgroundOrDefault } from '@past3lle/theme'
import { truncateAddress } from '@past3lle/utils'
import React from 'react'
import styled from 'styled-components'

import { ThemedButton } from '.'
import { MAIN_FG } from '../../../theme/constants'
import { useGenericImageSrcSet } from '../../../theme/global'
import { useAssetsMap } from '../../../theme/utils'
import { MonospaceText } from '../Text'

export function ConnectionInfoButton() {
  const { address } = useW3UserConnectionInfo()
  const { onAccountClick } = useW3AccountNetworkActions()

  const assetsMap = useAssetsMap()
  const logoUrlMaps = useGenericImageSrcSet()

  const isSmallWidth = useIsSmallMediaWidth()

  if (isSmallWidth) {
    return (
      <ThemedButton
        bgColor={'black'}
        bgImage={logoUrlMaps.EMPTY_SKILL_DDPX_URL_MAP ?? undefined}
        bgBlendMode="hard-light"
        title={'Click to view skills inventory and account information'}
        display="flex"
        flexDirection={'row-reverse'}
        alignItems="center"
        gap="0 0.5rem"
        height="80%"
        padding="0.5rem"
        onClick={onAccountClick}
      >
        <MonospaceText color={MAIN_FG} fontSize="1.05rem" marginLeft="-0.2rem">
          account
        </MonospaceText>
        <img src={assetsMap.icons.shop} style={{ maxWidth: '2.8rem' }} />
      </ThemedButton>
    )
  } else {
    return (
      <ConnectionInfoContainer
        title={'Account and connection information. Click to view/change accounts.'}
        width={'26rem'}
        minWidth={'24rem'}
        marginTop="0.6rem"
        gap="0.5rem"
        onClick={onAccountClick}
      >
        <img src={assetsMap.icons.connection} />
        <Text.SubHeader
          margin="0 0 1rem 0"
          padding={0}
          fontWeight={!!address ? 500 : 700}
          fontStyle="normal"
          fontFamily="monospace"
          letterSpacing="-1.6px"
        >
          <ConnectionStatusWrapper isConnected={!!address}>
            {!address && <span>LOGIN</span>}{' '}
            <small>{`${address ? truncateAddress(address, { type: 'long' }) : 'TO VIEW SKILLS'}`}</small>
          </ConnectionStatusWrapper>
        </Text.SubHeader>
      </ConnectionInfoContainer>
    )
  }
}

const ConnectionInfoContainer = styled(Row).attrs({ justifyContent: 'center', alignItems: 'center' })`
  min-width: 257px;
  min-height: 8rem;
  cursor: pointer;
  > img {
    max-width: 8%;
    margin-bottom: 0.95rem;
    opacity: 0.8;
  }
  small {
    text-shadow: 3px 2px 1px #ffffffc9;
  }
  filter: invert(1);
  ${({ theme }) => fromSmall`
    ${
      theme.assetsMap.images.background.header?.account &&
      setBackgroundOrDefault(
        theme,
        { bgValue: theme.assetsMap.images.background.header.account, defaultValue: 'transparent' },
        { backgroundAttributes: ['center/contain no-repeat'], backgroundColor: 'transparent' }
      )
    }}
  `}
`

const ConnectionStatusWrapper = styled.div<{ isConnected: boolean }>`
  color: #000;
  > span {
    font-size: 2rem;
    font-weight: 900;
    text-shadow: 3px 2px 1px #ffffffc9;
  }
  > small {
    font-size: 1.3rem;
    font-weight: 100;
    margin-left: -0.3rem;

    ${({ isConnected }) =>
      isConnected &&
      `
      color: #49a749;
      font-size: 1.6rem;
      margin-left: 0;
    `}
  }
`
