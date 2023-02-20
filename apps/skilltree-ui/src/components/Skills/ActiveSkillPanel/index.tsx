import { Skillpoint } from '../Skillpoint'
import { SkillpointPoint } from '../Skillpoint/SkillpointPoint'
import { Rarity, SkillId } from '../types'
import { Row, AutoRow, ExternalLink, Text, Column, RowProps, RowStart } from '@past3lle/components'
import { BLACK, OFF_WHITE, upToSmall } from '@past3lle/theme'
import { ThemedButtonExternalLink } from 'components/Button'
import { SidePanel } from 'components/SidePanel'
import { AutoColorHeader, BlackHeader, MonospaceText } from 'components/Text'
import { BigNumber } from 'ethers'
import { useGetActiveSkill } from 'hooks/skills'
import { darken } from 'polished'
import React, { useMemo } from 'react'
import { MetadataState, useMetadataMapReadAtom } from 'state/Metadata'
import { UserBalances, useUserBalancesReadAtom } from 'state/User'
import styled from 'styled-components/macro'
import { RARITY_COLOURS_MAP } from 'theme/constants'
import { CUSTOM_THEME } from 'theme/customTheme'
import { getLockStatus, SkillLockStatus } from 'utils/skills'

export function ActiveSkillPanel() {
  const [metadataMap] = useMetadataMapReadAtom()
  const activeSkillState = useGetActiveSkill()
  const [balances] = useUserBalancesReadAtom()

  const activeSkill = activeSkillState?.[0]
  const setSkillState = activeSkillState?.[1]

  const lockStatus = useMemo(() => getLockStatus(activeSkill, balances), [activeSkill, balances])
  const isLocked = lockStatus === SkillLockStatus.LOCKED
  const isOwned = lockStatus === SkillLockStatus.OWNED

  const description = useMemo(
    () => _getSkillDescription(activeSkill?.name, lockStatus),
    [activeSkill?.name, lockStatus]
  )

  const { rarity, deps, cardColour } = useMemo(
    () => ({
      rarity: activeSkill?.properties.rarity,
      deps: activeSkill?.properties.dependencies,
      get cardColour() {
        return isLocked
          ? CUSTOM_THEME.gradients.lockedSkill
          : this.rarity
          ? CUSTOM_THEME.gradients.unlockedSkill + `${CUSTOM_THEME.rarity[this.rarity].backgroundColor})`
          : null
      }
    }),
    [activeSkill?.properties.dependencies, activeSkill?.properties.rarity, isLocked]
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
          <RowStart letterSpacing="-2.6px" style={{ position: 'absolute', left: 0, top: 0, width: 'auto' }}>
            <AutoColorHeader
              bgColour={_getLockStatusColour(lockStatus, rarity)}
              fgColour={BLACK}
              width={'inherit'}
              fontWeight={400}
              fontSize={'2.5rem'}
              padding="0.25rem 2rem"
              borderRadius="0 0 10px 0"
            >
              {lockStatus}
            </AutoColorHeader>
            <BlackHeader
              width={'inherit'}
              color={OFF_WHITE}
              fontWeight={500}
              fontSize={'2.5rem'}
              padding="0.25rem 2rem"
              borderRadius="0"
              textShadow={`1px 1px 1px ${darken(0.3, CUSTOM_THEME.rarity[rarity].backgroundColor)}`}
              display={'flex'}
              justifyContent="space-evenly"
              alignItems={'center'}
            >
              <img
                src={require(`assets/png/icons/icons8-diamonds-${rarity}-64.png`)}
                style={{ maxWidth: '2.5rem', marginRight: '0.5rem' }}
              />
              {rarity?.toLocaleUpperCase()} SKILL
            </BlackHeader>
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
              padding: 0,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              disabled: isLocked,
              css: `img {border-radius: 10px;}`
            }}
          />
          <ThemedButtonExternalLink
            className={isLocked ? 'disabled' : ''}
            disabled={isLocked}
            href={isLocked ? '#' : `https://pastelle.shop/#/collection/${activeSkill?.name?.toLowerCase()}`}
          >
            <Text.Black fontWeight={300}>{isLocked ? 'LOCKED' : 'VIEW IN STORE'}</Text.Black>
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
                <strong style={{ color: CUSTOM_THEME.mainBg }}>OpenSea</strong>{' '}
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
              <strong style={{ color: CUSTOM_THEME.mainBg }}>tutorial</strong>{' '}
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
  metadataMap: MetadataState['metadataMap']
  balances: UserBalances
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
              css={`
                box-shadow: unset;
              `}
            />
          )
        )
      })}
    </SkillsRowContainer>
  )
}
const SkillsRowContainer = styled(Row)`
  position: relative;
  z-index: 1;
  padding-right: 4rem;

  > div#blur-div {
    position: absolute;
    right: 0;
    top: 0;
    width: 6rem;
    height: 100%;
    z-index: 5;
  }
`
const ActiveSkillPanelContainer = styled(Column)`
  height: 100%;

  padding: 0 4rem;
  overflow-y: auto;
  overflow-x: hidden;

  ${Row}#skill-image-and-store-button {
    > img {
      max-width: 40%;
    }
    > ${ThemedButtonExternalLink} {
      padding: 1.5rem;
      > * {
        font-size: 2rem;

        ${upToSmall`
          font-size: 1.8rem;
        `}
      }
    }
  }
`

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

function _getLockStatusColour(lockStatus: SkillLockStatus, rarity: Rarity) {
  switch (lockStatus) {
    case SkillLockStatus.LOCKED:
      return 'darkred'
    case SkillLockStatus.UNLOCKED:
      return 'darkgreen'
    case SkillLockStatus.OWNED:
      return RARITY_COLOURS_MAP[rarity]
  }
}
