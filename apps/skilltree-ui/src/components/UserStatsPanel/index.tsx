import { Column, Row } from '@past3lle/components'
import { upToSmall } from '@past3lle/theme'
import { SidePanel } from 'components/SidePanel'
import { Skillpoint } from 'components/Skills/Skillpoint'
import { StyledSkillpoint } from 'components/Skills/common'
import { CursiveMonoHeader, MonospaceText } from 'components/Text'
import { UserConnectionStats } from 'components/UserWeb3ConnectionStats'
import React from 'react'
import { useSkillsAtom } from 'state/Skills'
import styled from 'styled-components/macro'
import { CUSTOM_THEME } from 'theme/customTheme'

export function UserStatsPanel() {
  const [{ vectors }] = useSkillsAtom()
  return (
    <SidePanel header="SKILLPOINTS">
      <UserStatsPanelContainer>
        <Row padding="0.2rem 2rem" gap="1rem" backgroundColor={CUSTOM_THEME.mainBg}>
          <CursiveMonoHeader
            text="CONNECTION"
            capitalLetterProps={{ width: 'auto', display: 'flex', alignItems: 'center' }}
            restWordProps={{ fontSize: '3.2rem' }}
          />
        </Row>
        <br />
        <UserConnectionStats />
        <br />
        <br />
        <Row padding="0.2rem 2rem" gap="1rem" backgroundColor={CUSTOM_THEME.mainBg}>
          <CursiveMonoHeader
            text="INVENTORY"
            capitalLetterProps={{ width: 'auto', display: 'flex', alignItems: 'center' }}
            restWordProps={{ fontSize: '3.2rem' }}
          />
        </Row>
        <br />
        <UserSkillpointsContainer>
          {vectors.map((skill) => skill.skill && <Skillpoint key={skill.skill.properties.id} metadata={skill.skill} />)}
        </UserSkillpointsContainer>
      </UserStatsPanelContainer>
    </SidePanel>
  )
}

const UserStatsPanelContainer = styled(Column)`
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
  height: 300px;
  overflow-y: auto;
  justify-content: space-evenly;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;

  > ${StyledSkillpoint} {
    flex: 0 1 10vh;
  }
`
