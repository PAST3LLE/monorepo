import { AutoRow, ExternalLink, Row, RowCenter, Text } from '@past3lle/components'
import {
  SkillLockStatus,
  useDeriveSkillState,
  useForgeBalancesReadAtom,
  useForgeMetadataMapReadAtom,
  useForgeUserConfigAtom,
  useSupportedOrDefaultChainId
} from '@past3lle/forge-web3'
import { BLACK, OFF_WHITE } from '@past3lle/theme'
import { darken } from 'polished'
import React, { useMemo, useRef } from 'react'
import { DefaultTheme, useTheme } from 'styled-components'

import { SKILLPOINTS_CONTAINER_ID } from '../../../constants/skills'
import { useGetActiveSkill } from '../../../hooks/skills'
import { baseTheme } from '../../../theme/base'
import { buildSkillMetadataExplorerUri } from '../../../utils/skills'
import { BlackHeader, MonospaceText } from '../../Common/Text'
import { Skillpoint } from '../../Skillpoint'
// import { SkillpointPoint } from '../../Skillpoint/SkillpointPoint'
import { SidePanel } from '../BaseSidePanel'
import { SkillsRow } from '../common'
import { SkillActionButton } from './SkillActionButton'
import { ActiveSkillPanelContainer, RequiredDepsContainer, SkillRarityLabel, SkillStatusLabel } from './styleds'
import { getLockStatusColour, getSkillDescription } from './utils'

export function ActiveSkillPanel() {
  const chainId = useSupportedOrDefaultChainId()
  const [userConfig] = useForgeUserConfigAtom()

  const [metadataMap] = useForgeMetadataMapReadAtom(chainId)
  const activeSkillState = useGetActiveSkill(chainId)
  const [balances] = useForgeBalancesReadAtom()

  const activeSkill = activeSkillState?.[0]
  const setSkillState = activeSkillState?.[1]

  const lockStatus = useDeriveSkillState(activeSkill)
  const isLocked = lockStatus === SkillLockStatus.LOCKED || lockStatus === SkillLockStatus.UNLOCKABLE_IN_TRADE
  const isOwned = lockStatus === SkillLockStatus.OWNED

  const description = useMemo(() => getSkillDescription(activeSkill?.name, lockStatus), [activeSkill?.name, lockStatus])

  const { assetsMap, ...customTheme } = useTheme()

  const { rarity, deps, cardColour, metadataExplorerUri } = useMemo(
    () => ({
      metadataExplorerUri: buildSkillMetadataExplorerUri('opensea', activeSkill, chainId),
      rarity: activeSkill?.properties.rarity,
      deps: activeSkill?.properties.dependencies,
      get cardColour() {
        return isLocked
          ? baseTheme.gradients.lockedSkill
          : this.rarity
          ? baseTheme.gradients.unlockedSkill + `${customTheme.rarity[this.rarity].backgroundColor})`
          : null
      }
    }),
    [activeSkill, chainId, customTheme.rarity, isLocked]
  )

  const skillContainerRef = useRef<HTMLElement>(
    typeof document !== undefined ? document.getElementById(SKILLPOINTS_CONTAINER_ID) : null
  )

  if (!metadataExplorerUri || !activeSkill || !rarity || !deps || !cardColour || !setSkillState) return null

  return (
    <SidePanel
      header={activeSkill?.name || 'Unknown'}
      styledProps={{
        background: cardColour,
        padding: '2.5rem 0 4rem 0'
      }}
      options={{
        onClickOutsideConditionalCb: (targetNode: Node) => !!skillContainerRef?.current?.contains(targetNode)
      }}
      onDismiss={() => setSkillState((state) => ({ ...state, active: [] }))}
      onBack={() => setSkillState((state) => ({ ...state, active: state.active.slice(1) }))}
    >
      <ActiveSkillPanelContainer gap="1rem">
        <Row justifyContent={'center'} margin="0">
          <Text.SubHeader fontSize={'2.5rem'} fontWeight={200}>
            {description}
          </Text.SubHeader>
        </Row>
        <Row
          id="skill-image-and-store-button"
          justifyContent={'space-around'}
          marginBottom="12%"
          flexWrap={'wrap'}
          gap="1rem 4rem"
        >
          <Skillpoint
            className={isLocked ? 'disabled' : ''}
            forceRarity="empty"
            metadata={activeSkill}
            hasSkill={!isLocked}
            skillpointStyles={{
              height: '80%',
              flex: 1.4,
              padding: '0',
              backgroundColor: 'transparent',
              justifyContent: 'center',
              disabled: isLocked,
              css: `
                > ${RowCenter} {
                  min-height: 200px;
                  height: 20vh;
                  > img {
                    border-radius: 10px;
                  }
                }
              `
            }}
          />
          <SkillActionButton skill={activeSkill} lockStatus={lockStatus} metadataExplorerUri={metadataExplorerUri} />
        </Row>
        <Row alignSelf="flex-start" width="100%" justifyContent={'center'} gap="1rem">
          <SkillStatusLabel
            bgColour={getLockStatusColour(lockStatus, customTheme as DefaultTheme)}
            fgColour={BLACK}
            fontWeight={500}
            borderRadius="0.3rem"
            letterSpacing={-2.2}
            flex={1}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            height="100%"
            textShadow={lockStatus !== SkillLockStatus.OWNED ? '1px 1px 1px #000000ba' : 'none'}
          >
            {lockStatus === SkillLockStatus.UNLOCKABLE_IN_STORE || lockStatus === SkillLockStatus.UNLOCKABLE_IN_TRADE
              ? 'UNLOCKABLE'
              : lockStatus}
          </SkillStatusLabel>
          <SkillRarityLabel
            backgroundColor={darken(0.02, customTheme.rarity[rarity].backgroundColor)}
            color={OFF_WHITE}
            fontWeight={100}
            borderRadius="0.3rem"
            flex={1}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            style={{ gap: '0.3rem' }}
            height="100%"
            textShadow={`1px 1px 1px ${darken(0.3, customTheme.rarity[rarity].backgroundColor)}`}
          >
            <img src={assetsMap.icons.rarity[rarity]} style={{ maxWidth: '3rem' }} />
            <strong>{rarity?.toLocaleUpperCase()}</strong>
          </SkillRarityLabel>
        </Row>
        {!isOwned && deps.length > 0 && (
          <RequiredDepsContainer
            overflow={'visible'}
            marginBottom={'2rem'}
            background="linear-gradient(90deg, black, transparent 80%)"
          >
            <BlackHeader fontSize={'2.5rem'} fontWeight={300} margin="0" padding="1rem 1rem 0.25rem 1rem">
              REQUIRED TO UNLOCK
            </BlackHeader>
            <SkillsRow balances={balances} deps={deps} metadataMap={metadataMap} />
          </RequiredDepsContainer>
        )}
        {((!isLocked && !deps.length) || isOwned) && chainId && (
          <AutoRow>
            <MonospaceText>
              View on{' '}
              <ExternalLink href={metadataExplorerUri}>
                {' '}
                <strong style={{ color: baseTheme.mainBg }}>OpenSea</strong>{' '}
              </ExternalLink>{' '}
            </MonospaceText>
          </AutoRow>
        )}
        {userConfig?.contentUrls?.claiming && (
          <Row marginTop={'4rem'}>
            <MonospaceText>
              Checkout this{' '}
              <ExternalLink href={userConfig.contentUrls.claiming}>
                {' '}
                <strong style={{ color: baseTheme.mainBg }}>tutorial</strong>{' '}
              </ExternalLink>{' '}
              to understand how to claim skills!
            </MonospaceText>
          </Row>
        )}
      </ActiveSkillPanelContainer>
    </SidePanel>
  )
}
