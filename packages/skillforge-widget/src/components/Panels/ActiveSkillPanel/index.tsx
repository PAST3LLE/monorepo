import { BigNumber } from '@ethersproject/bignumber'
import { AutoRow, Column, ExternalLink, Row, RowProps, RowStart, Text } from '@past3lle/components'
import {
  SkillForgeBalances,
  SkillForgeMetadataState,
  SkillId,
  SkillLockStatus,
  SkillMetadata,
  SkillRarity,
  getLockStatus,
  useSkillForgeBalancesReadAtom,
  useSkillForgeMetadataMapReadAtom
} from '@past3lle/skillforge-web3'
import { BLACK, OFF_WHITE } from '@past3lle/theme'
import { darken } from 'polished'
import React, { useMemo } from 'react'
import styled, { useTheme } from 'styled-components'

import { SHOP_URL } from '../../../constants'
import { useGetActiveSkill } from '../../../hooks/skills'
import { baseTheme } from '../../../theme/base'
import { RARITY_COLOURS_MAP } from '../../../theme/constants'
import { ThemedButtonExternalLink } from '../../Common/Button'
import { BlackHeader, MonospaceText } from '../../Common/Text'
import { Skillpoint } from '../../Skillpoint'
import { SkillpointPoint } from '../../Skillpoint/SkillpointPoint'
import { SidePanel } from '../BaseSidePanel'
import { ActiveSkillPanelContainer, SkillRarityLabel, SkillStatusLabel, SkillsRowContainer } from './styleds'

export function ActiveSkillPanel() {
  const [metadataMap] = useSkillForgeMetadataMapReadAtom()
  const activeSkillState = useGetActiveSkill()
  const [balances] = useSkillForgeBalancesReadAtom()

  const activeSkill = activeSkillState?.[0]
  const setSkillState = activeSkillState?.[1]

  const lockStatus = useMemo(() => getLockStatus(activeSkill, balances), [activeSkill, balances])
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

  if (!activeSkill || !rarity || !deps || !cardColour || !setSkillState) return null

  return (
    <SidePanel
      header={activeSkill?.name || 'Unknown'}
      styledProps={{
        background: cardColour,
        padding: '6rem 0 4rem 0'
      }}
      onDismiss={() => setSkillState((state) => ({ ...state, active: [] }))}
      onBack={() => setSkillState((state) => ({ ...state, active: state.active.slice(1) }))}
    >
      <ActiveSkillPanelContainer>
        <Column overflow="hidden">
          <RowStart letterSpacing="-2.6px" style={{ position: 'absolute', left: 0, top: -1, width: 'auto' }}>
            <SkillStatusLabel
              bgColour={_getLockStatusColour(lockStatus, rarity)}
              fgColour={BLACK}
              fontWeight={400}
              borderRadius="0 0 10px 0"
            >
              {lockStatus}
            </SkillStatusLabel>
            <SkillRarityLabel
              color={OFF_WHITE}
              fontWeight={500}
              borderRadius="0"
              textShadow={`1px 1px 1px ${darken(0.3, customTheme.rarity[rarity].backgroundColor)}`}
            >
              <img src={assetsMap.icons.rarity[rarity]} style={{ maxWidth: '2.5rem', marginRight: '0.5rem' }} />
              {rarity?.toLocaleUpperCase()} SKILL
            </SkillRarityLabel>
          </RowStart>
        </Column>
        <Row justifyContent={'center'} margin="0">
          <Text.SubHeader fontSize={'2.5rem'} fontWeight={200}>
            {description}
          </Text.SubHeader>
        </Row>
        <Row
          id="skill-image-and-store-button"
          justifyContent={'space-around'}
          marginBottom="auto"
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
              css: `img {border-radius: 10px;}`
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
        {!isLocked && (
          <AutoRow>
            <MonospaceText>
              View on{' '}
              <ExternalLink href="#">
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
  deps: SkillId[]
  metadataMap: SkillForgeMetadataState['metadataMap']
  balances: SkillForgeBalances
  rowProps?: RowProps
}
function SkillsRow({ balances, deps, metadataMap, rowProps }: SkillsRowProps) {
  return (
    <SkillsRowContainer padding="1rem" gap="0 1.7rem" overflowX={'auto'} {...rowProps}>
      <SkillpointPoint />
      <Row justifyContent={'center'} width="auto" minWidth={'2rem'} fontSize={'4rem'} fontWeight={100}>
        +
      </Row>
      {deps.flatMap((skillId) => {
        // TODO: remove this
        if (typeof skillId === 'object') return 'COMING SOON...'
        const skill = metadataMap[skillId]
        return (
          skill && (
            <Skillpoint
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

const STORE_URL = process.env.NODE_ENV === 'production' ? SHOP_URL : 'http://localhost:8080'
function _getSkillShopUri(activeSkill: SkillMetadata) {
  return `${STORE_URL}/#/SKILLS/${activeSkill.name.toLowerCase()}?referral=FORGE&id=${activeSkill.properties.shopifyId.replace(
    'gid://shopify/Product/',
    ''
  )}`
}
