import { AutoRow, ExternalLink, Row, RowCenter, Text } from '@past3lle/components'
import {
  SkillLockStatus,
  useDeriveSkillState,
  useForgeBalancesReadAtom,
  useForgeMetadataMapReadAtom,
  useSupportedChainId
} from '@past3lle/forge-web3'
import { BLACK, OFF_WHITE } from '@past3lle/theme'
import { darken } from 'polished'
import React, { useMemo, useRef } from 'react'
import { useTheme } from 'styled-components'

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
  const [metadataMap] = useForgeMetadataMapReadAtom()
  const activeSkillState = useGetActiveSkill()
  const [balances] = useForgeBalancesReadAtom()

  const chainId = useSupportedChainId()

  const activeSkill = activeSkillState?.[0]
  const setSkillState = activeSkillState?.[1]

  const lockStatus = useDeriveSkillState(activeSkill)
  const isLocked = lockStatus === SkillLockStatus.LOCKED
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

  const skillContainerRef = useRef<HTMLElement>(document.getElementById(SKILLPOINTS_CONTAINER_ID))

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
        <Row alignSelf="flex-start" width="auto">
          <SkillStatusLabel
            bgColour={getLockStatusColour(lockStatus, rarity)}
            fgColour={BLACK}
            fontWeight={400}
            borderRadius="0.3rem"
            letterSpacing={-2.2}
          >
            {lockStatus}
          </SkillStatusLabel>
          <SkillRarityLabel
            backgroundColor={darken(0.02, customTheme.rarity[rarity].backgroundColor)}
            color={OFF_WHITE}
            fontWeight={100}
            borderRadius="0.3rem"
            marginLeft="0.75rem"
            textShadow={`1px 1px 1px ${darken(0.3, customTheme.rarity[rarity].backgroundColor)}`}
          >
            <img src={assetsMap.icons.rarity[rarity]} style={{ maxWidth: '2.5rem', marginRight: '0.3rem' }} />
            <strong>{rarity?.toLocaleUpperCase()}</strong> SKILL
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
        <Row marginTop={'4rem'}>
          <MonospaceText>
            Checkout this{' '}
            <ExternalLink href="#">
              {' '}
              <strong style={{ color: baseTheme.mainBg }}>tutorial</strong>{' '}
            </ExternalLink>{' '}
            to understand how to claim your skillpoint NFT.
          </MonospaceText>
        </Row>
      </ActiveSkillPanelContainer>
    </SidePanel>
  )
}
