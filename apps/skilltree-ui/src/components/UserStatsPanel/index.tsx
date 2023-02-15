import { Column, Row, Text } from '@past3lle/components'
import { upToSmall } from '@past3lle/theme'
import ACCOUNT from 'assets/png/icons/icons8-footman-100.png'
import TREASURE_CHEST_GREEN from 'assets/png/icons/icons8-treasure-chest-90-green.png'
import { SidePanel } from 'components/SidePanel'
import { Skillpoint } from 'components/Skills/Skillpoint'
// import { StyledSkillpoint } from 'components/Skills/common'
import { CursiveMonoHeader, MonospaceText } from 'components/Text'
import { UserConnectionStats } from 'components/UserWeb3ConnectionStats'
import React from 'react'
import { useSkillsAtom } from 'state/Skills'
import styled from 'styled-components/macro'
import { MAIN_FG } from 'theme/constants'
import { CUSTOM_THEME } from 'theme/customTheme'

export function UserStatsPanel() {
  const [{ vectors }] = useSkillsAtom()
  return (
    <SidePanel header="STATS & SKILLS">
      <UserStatsPanelContainer>
        <Row padding="1rem 2rem" gap="0 1rem" backgroundColor={CUSTOM_THEME.mainBg}>
          <img src={ACCOUNT} style={{ maxWidth: '4rem' }} />
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
        </Row>

        <UserConnectionStats containerProps={{ margin: '2rem 0' }} />

        <Row padding="1rem 2rem" gap="0 1rem" backgroundColor={CUSTOM_THEME.mainBg}>
          <img src={TREASURE_CHEST_GREEN} style={{ maxWidth: '4rem' }} />
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
            {vectors.length}/{vectors.length} COLLECTED
          </Text.SubHeader>
        </Row>
        <UserSkillpointsContainer>
          {vectors.map(
            (skill) =>
              skill.skill && (
                <Row key={skill.skill.properties.id} justifyContent="center" alignItems="center">
                  <Skillpoint metadata={skill.skill} />
                </Row>
              )
          )}
        </UserSkillpointsContainer>
      </UserStatsPanelContainer>
    </SidePanel>
  )
}

const UserStatsPanelContainer = styled(Column)`
  overflow: hidden;
  height: 100%;
  padding: 2rem 0 0;

  ${() => upToSmall`
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
  min-height: 400px;
  height: 100%;
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
