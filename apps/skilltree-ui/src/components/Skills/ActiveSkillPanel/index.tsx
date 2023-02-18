import { Skillpoint } from '../Skillpoint'
// import { ipfsToImageUri } from '../utils'
import { Row, AutoRow, ExternalLink, Text, Column } from '@past3lle/components'
import { upToSmall } from '@past3lle/theme'
import { ThemedButtonExternalLink } from 'components/Button'
import { SidePanel } from 'components/SidePanel'
import { MonospaceText } from 'components/Text'
import { BigNumber } from 'ethers'
import { useGetActiveSkill } from 'hooks/skills'
import React, { useMemo } from 'react'
import { useMetadataMapReadAtom } from 'state/Metadata'
import { useUserBalancesReadAtom } from 'state/User'
import styled from 'styled-components/macro'
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
  const isUnlocked = lockStatus === SkillLockStatus.UNLOCKED

  const description = useMemo(
    () =>
      isLocked
        ? "You can't get this skill yet. Click and view prerequisite skill(s) below."
        : isUnlocked
        ? `Buy ${activeSkill?.name || 'skill'} and receive a free NFT skillpoint giving you access to exclusive perks.`
        : `Nice, you already own ${activeSkill?.name}. See below for which later skills depend on this skill to level-up, and head to the store to get new ones.`,
    [activeSkill?.name, isLocked, isUnlocked]
  )

  if (!activeSkill || !setSkillState) return null

  const deps = activeSkill.properties.dependencies
  const backgroundColor = isLocked
    ? CUSTOM_THEME.gradients.lockedSkill
    : isOwned
    ? CUSTOM_THEME.gradients.ownedSkill
    : CUSTOM_THEME.gradients.unlockedSkill

  return (
    <SidePanel
      header={activeSkill?.name || 'Unknown'}
      styledProps={{
        background: backgroundColor,
        padding: '4rem 0'
      }}
      onDismiss={() => setSkillState((state) => ({ ...state, active: [] }))}
      onBack={() => setSkillState((state) => ({ ...state, active: state.active.slice(1) }))}
    >
      <ActiveSkillPanelContainer>
        <Row justifyContent={'center'} margin="0 0 13% 0">
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
          {activeSkill?.image && (
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
                disabled: isLocked
              }}
            />
          )}
          <ThemedButtonExternalLink
            className={isLocked ? 'disabled' : ''}
            disabled={isLocked}
            href={isLocked ? '#' : `https://pastelle.shop/#/collection/${activeSkill?.name?.toLowerCase()}`}
          >
            <Text.Black fontWeight={300}>{isLocked ? 'LOCKED' : 'VIEW IN STORE'}</Text.Black>
          </ThemedButtonExternalLink>
        </Row>
        {deps.length > 0 && (
          <Column>
            <Text.SubHeader fontSize={'2.5rem'} fontWeight={200} margin="0">
              PREREQUISITES
            </Text.SubHeader>
            <Row padding="1rem">
              {deps.flatMap((skillId) => {
                // TODO: remove this
                if (typeof skillId === 'object') return 'COMING SOON...'
                const skill = metadataMap[skillId]
                return (
                  <Skillpoint
                    // @ts-ignore
                    title={skill.name}
                    hasSkill={!BigNumber.from(balances?.[skillId] || 0).isZero()}
                    metadata={skill}
                  />
                )
              })}
            </Row>
          </Column>
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

const ActiveSkillPanelContainer = styled(Column)`
  height: 100%;

  padding: 0 4rem;
  overflow-y: auto;

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
