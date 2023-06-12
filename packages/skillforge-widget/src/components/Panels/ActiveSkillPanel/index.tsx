import { BigNumber } from '@ethersproject/bignumber'
import { AutoRow, Column, ExternalLink, Row, RowCenter, RowProps, Text } from '@past3lle/components'
import {
  ForgeBalances,
  ForgeMetadataState,
  SkillDependencyObject,
  SkillId,
  SkillLockStatus,
  SkillMetadata,
  SkillRarity,
  useDeriveSkillState,
  useForgeBalancesReadAtom,
  useForgeMetadataMapReadAtom,
  useSupportedChainId
} from '@past3lle/forge-web3'
import { BLACK, OFF_WHITE } from '@past3lle/theme'
import { darken } from 'polished'
import React, { useMemo, useRef } from 'react'
import styled, { useTheme } from 'styled-components'

import { SHOP_URL } from '../../../constants'
import { SKILLPOINTS_CONTAINER_ID } from '../../../constants/skills'
import { useGetActiveSkill } from '../../../hooks/skills'
import { baseTheme } from '../../../theme/base'
import { RARITY_COLOURS_MAP } from '../../../theme/constants'
import { buildSkillMetadataExplorerUri } from '../../../utils/skills'
import { ThemedButtonExternalLink } from '../../Common/Button'
import { BlackHeader, MonospaceText } from '../../Common/Text'
import { Skillpoint } from '../../Skillpoint'
// import { SkillpointPoint } from '../../Skillpoint/SkillpointPoint'
import { SidePanel } from '../BaseSidePanel'
import { ActiveSkillPanelContainer, SkillRarityLabel, SkillStatusLabel, SkillsRowContainer } from './styleds'

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

  const description = useMemo(
    () => _getSkillDescription(activeSkill?.name, lockStatus),
    [activeSkill?.name, lockStatus]
  )

  const { assetsMap, ...customTheme } = useTheme()

  const { rarity, deps, cardColour } = useMemo(
    () => ({
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
    [activeSkill?.properties.dependencies, activeSkill?.properties.rarity, customTheme.rarity, isLocked]
  )

  const skillContainerRef = useRef<HTMLElement>(document.getElementById(SKILLPOINTS_CONTAINER_ID))

  if (!activeSkill || !rarity || !deps || !cardColour || !setSkillState) return null

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
          <ThemedButtonExternalLink
            className={isLocked ? 'disabled' : ''}
            disabled={isLocked}
            href={isLocked ? '#' : _getSkillShopUri(activeSkill)}
          >
            <Text.Black fontWeight={300}>{isLocked ? 'LOCKED' : isOwned ? 'VIEW IN STORE' : 'UNLOCK'}</Text.Black>
          </ThemedButtonExternalLink>
        </Row>
        <Row alignSelf="flex-start" width="auto">
          <SkillStatusLabel
            bgColour={_getLockStatusColour(lockStatus, rarity)}
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
        {!isLocked && chainId && (
          <AutoRow>
            <MonospaceText>
              View on{' '}
              <ExternalLink href={buildSkillMetadataExplorerUri('opensea', activeSkill, chainId)}>
                {' '}
                <strong style={{ color: baseTheme.mainBg }}>OpenSea</strong>{' '}
              </ExternalLink>{' '}
            </MonospaceText>
          </AutoRow>
        )}
        {/* <AutoRow>
          <MonospaceText>Connect Wallet</MonospaceText>
        </AutoRow> */}
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
const RequiredDepsContainer = styled(Column)<{ borderRadius?: string; background?: string }>``

interface SkillsRowProps {
  deps: SkillDependencyObject[]
  metadataMap: ForgeMetadataState['metadataMap'][number]
  balances: ForgeBalances[number]
  rowProps?: RowProps
}
function SkillsRow({ balances, deps, metadataMap, rowProps }: SkillsRowProps) {
  return (
    <SkillsRowContainer padding="1rem" gap="0 1.7rem" overflowX={'auto'} {...rowProps}>
      {/* 
      // TODO: review - right now disabled as not required in contracts
      <SkillpointPoint />
      <Row justifyContent={'center'} width="auto" minWidth={'2rem'} fontSize={'4rem'} fontWeight={100}>
        +
      </Row> */}
      {deps.flatMap(({ token, id }) => {
        const skillId: SkillId = `${token}-${id}`
        const skill = metadataMap[skillId]
        return (
          skill && (
            <Skillpoint
              key={skill.properties.id}
              // @ts-ignore
              title={skill.name}
              hasSkill={!BigNumber.from(balances?.[skillId] || 0).isZero()}
              metadata={skill}
              css="box-shadow: unset;"
            />
          )
        )
      })}
    </SkillsRowContainer>
  )
}

function _getSkillDescription(name: string | undefined, lockStatus: SkillLockStatus) {
  switch (lockStatus) {
    case SkillLockStatus.LOCKED:
      return "You can't get this skill yet. Click/view required skill(s) below."
    case SkillLockStatus.UNLOCKED:
      return `Buy ${
        name || 'this skill'
      } in the shop and receive a free skill + skillpoint giving you access to exclusive perks.`
    case SkillLockStatus.OWNED:
      return (
        <>
          Nice, you already own {name || 'this skill'}. <br />
          What now? Head to the shop to get new pieces and earn more skills + skillpoints!
        </>
      )
    default:
      return 'Skill information missing. Please try again later.'
  }
}

function _getLockStatusColour(lockStatus: SkillLockStatus, rarity: SkillRarity) {
  switch (lockStatus) {
    case SkillLockStatus.LOCKED:
      return 'darkred'
    case SkillLockStatus.UNLOCKED:
      return 'darkgreen'
    case SkillLockStatus.OWNED:
      return RARITY_COLOURS_MAP[rarity]
  }
}

// TODO: this fn should be local to the project using SkillForge Widget
const STORE_URL = process.env.NODE_ENV === 'production' ? SHOP_URL : 'http://localhost:8080'
function _getSkillShopUri(activeSkill: SkillMetadata) {
  return `${STORE_URL}/#/SKILLS/${(
    activeSkill?.attributes?.handle || activeSkill.name
  ).toLowerCase()}?referral=FORGE&id=${activeSkill.properties.shopifyId.replace('gid://shopify/Product/', '')}`
}
