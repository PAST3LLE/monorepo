import { Column, Row, Text } from '@past3lle/components'
import { upToSmall } from '@past3lle/theme'
import ACCOUNT from 'assets/png/icons/icons8-footman-100.png'
import TREASURE_CHEST_GREEN from 'assets/png/icons/icons8-treasure-chest-90-green.png'
import { SidePanel } from 'components/SidePanel'
import { Skillpoint } from 'components/Skills/Skillpoint'
import { CursiveMonoHeader, MonospaceText } from 'components/Text'
import { UserConnectionStats } from 'components/UserWeb3ConnectionStats'
import { BigNumber } from 'ethers'
import { useGetSkillFromIdCallback } from 'hooks/skills'
import React, { useMemo } from 'react'
import { SkillGridPositionList, useSkillsAtom } from 'state/Skills'
import { useUserAtom } from 'state/User'
import styled from 'styled-components/macro'
import { MAIN_FG } from 'theme/constants'
import { CUSTOM_THEME } from 'theme/customTheme'

export function UserStatsPanel() {
  const [{ vectors }] = useSkillsAtom()
  const [{ balances }] = useUserAtom()

  const getSkill = useGetSkillFromIdCallback()

  const totalSkills = useMemo(() => vectors.filter((vectorObj) => !!vectorObj.skillId).length, [vectors])
  const ownedSkillsList = useMemo(() => {
    return vectors.reduce((acc, skill) => {
      const missingSkill = !skill.skillId || BigNumber.from(balances[skill.skillId]).isZero()
      if (!missingSkill) {
        acc.push(skill)
      }
      return acc
    }, [] as SkillGridPositionList)
  }, [balances, vectors])

  return (
    <SidePanel header="INVENTORY">
      <UserStatsPanelContainer>
        <Row padding="1rem 2rem" gap="0 1rem" backgroundColor={CUSTOM_THEME.mainBg}>
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
          <img className="icon8-icon" src={ACCOUNT} />
        </Row>

        <UserConnectionStats containerProps={{ margin: '2rem 0' }} />

        <Row padding="1rem 2rem" gap="0 1rem" backgroundColor={CUSTOM_THEME.mainBg}>
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
          <img className="icon8-icon" src={TREASURE_CHEST_GREEN} />
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
