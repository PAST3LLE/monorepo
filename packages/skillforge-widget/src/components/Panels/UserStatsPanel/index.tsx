import { Column, Row, Text } from '@past3lle/components'
import { useForgeBalancesReadAtom, useSupportedChainId } from '@past3lle/forge-web3'
import { upToSmall } from '@past3lle/theme'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useGetSkillFromIdCallback } from '../../../hooks/skills'
import { useSidePanelWriteAtom } from '../../../state/SidePanel'
import { SkillGridPositionList, useVectorsAtom } from '../../../state/Skills'
import { baseTheme } from '../../../theme/base'
import { MAIN_FG } from '../../../theme/constants'
import { useAssetsMap } from '../../../theme/utils'
import { CursiveMonoHeader, MonospaceText } from '../../Common/Text'
import { Skillpoint } from '../../Skillpoint'
import { UserConnectionStats } from '../../Web3/UserWeb3ConnectionStats'
import { SidePanel } from '../BaseSidePanel'

export function UserStatsPanel() {
  const chainId = useSupportedChainId()
  const [{ vectors }] = useVectorsAtom()
  const [balances] = useForgeBalancesReadAtom()

  const getSkill = useGetSkillFromIdCallback(chainId)

  const totalSkills = useMemo(() => vectors.filter((vectorObj) => !!vectorObj.skillId).length, [vectors])
  const ownedSkillsList = useMemo(() => {
    return vectors.reduce((acc, skill) => {
      const missingSkill = !skill.skillId || BigInt(balances?.[skill.skillId] || 0) === BigInt(0)
      if (!missingSkill) {
        acc.push(skill)
      }
      return acc
    }, [] as SkillGridPositionList)
  }, [balances, vectors])

  const assetsMap = useAssetsMap()
  const [, setPanelState] = useSidePanelWriteAtom()

  return (
    <SidePanel header="INVENTORY" onDismiss={() => setPanelState()}>
      <UserStatsPanelContainer>
        <Row padding="1rem 2rem" gap="0 1rem" backgroundColor={baseTheme.mainBg}>
          <CursiveMonoHeader
            text="ACCOUNT"
            capitalLetterProps={{ width: 'auto', display: 'flex', alignItems: 'center' }}
            restWordProps={{
              fontSize: '2.6rem',
              opacity: 0.85,
              textShadow: '2px 2px 2px #000000b0',
              fontFamily: 'aria',
              fontStyle: 'normal'
            }}
          />
          <img className="icon8-icon" src={assetsMap.icons.connection} />
        </Row>

        <UserConnectionStats containerProps={{ margin: '2rem 0' }} />

        <Row padding="1rem 2rem" gap="0 1rem" backgroundColor={baseTheme.mainBg}>
          <CursiveMonoHeader
            text="INVENTORY"
            capitalLetterProps={{ width: 'auto', display: 'flex', alignItems: 'center' }}
            restWordProps={{
              fontSize: '2.6rem',
              opacity: 0.85,
              textShadow: '2px 2px 2px #000000b0',
              fontFamily: 'aria',
              fontStyle: 'normal'
            }}
          />
          <Text.SubHeader fontSize="1.4rem" backgroundColor={MAIN_FG} fontWeight={300} margin={0}>
            {ownedSkillsList.length}/{totalSkills} SKILLS
          </Text.SubHeader>
          <img className="icon8-icon" src={assetsMap.icons.inventory} />
        </Row>
        <UserSkillpointsContainer>
          {ownedSkillsList.map(({ skillId }) => {
            const skill = skillId ? getSkill(skillId) : null
            return (
              skill && (
                <Row key={skillId} justifyContent="center" alignItems="center">
                  <Skillpoint metadata={skill} hasSkill />
                </Row>
              )
            )
          })}
        </UserSkillpointsContainer>
      </UserStatsPanelContainer>
    </SidePanel>
  )
}

const UserStatsPanelContainer = styled(Column)`
  overflow: hidden;
  height: 100%;
  padding: 2rem 0 0;

  img.icon8-icon {
    max-width: 3rem;
    margin-left: auto;
  }

  ${() => upToSmall`
   img.icon8-icon {
    max-width: 3rem;
   }

    ${CursiveMonoHeader} > * {
      font-size: 1.8rem;
    }
    
    ${UserConnectionStats} {
      padding: 1.4rem 1rem 1.4rem 1.4rem;
      gap: 0.75rem;
      border-radius: 0;
      > ${MonospaceText} {
        font-size: 1.5rem;
      }
    }
  `}
`

const UserSkillpointsContainer = styled(Row)`
  flex-flow: row wrap;

  overflow-y: auto;
  justify-content: space-evenly;
  align-items: center;
  gap: 1rem;
  padding: 1rem;

  > ${Row} {
    flex: 0 1 25%;
    justify-content: center;
    align-items: center;
  }
`
