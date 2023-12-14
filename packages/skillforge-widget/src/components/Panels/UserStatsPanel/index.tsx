import { Column, Row, Text } from '@past3lle/components'
import { useForgeBalancesReadAtom, useSupportedChainId } from '@past3lle/forge-web3'
import { upToSmall, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useGetSkillFromIdCallback } from '../../../hooks/skills'
import { useSidePanelWriteAtom } from '../../../state/SidePanel'
import { SkillGridPositionList, useVectorsAtom } from '../../../state/Skills'
import { useAssetsMap } from '../../../theme/utils'
import { CursiveHeader, CursiveMonoHeader, MonospaceText } from '../../Common/Text'
import { Skillpoint } from '../../Skillpoint'
import { UserConnectionStats } from '../../Web3/UserWeb3ConnectionStats'
import { SidePanel } from '../BaseSidePanel'
import { BgCssDpiProps, MAIN_COLOR } from '../BaseSidePanel/styleds'

const INVENTORY_BG_SETTINGS = {
  backgroundCss: {
    uri: '',
    options: {
      bgSet: urlToSimpleGenericImageSrcSet(
        'https://res.cloudinary.com/coin-nft/cache/1/76/ea/76eab8120b9caa03f5a9e602942742454367f087f206c1274623e7696753b151-MDY2MWVjM2EtYmNhMS00ZThjLThlOWEtZjJmY2RhYWJjZGMz'
      ),
      modeColors: ['magenta', 'magenta'],
      blendMode: 'difference'
    } as BgCssDpiProps
  }
}
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
    <SidePanel
      header="INVENTORY"
      options={{
        backgroundImageOptions: INVENTORY_BG_SETTINGS
      }}
      styledProps={{
        background: '#000000eb'
      }}
      onDismiss={() => setPanelState()}
    >
      <UserStatsPanelContainer>
        <UserConnectionStats containerProps={{ margin: '2rem 0' }} />
        <Row padding="1rem 2rem" gap="0 1rem">
          <CursiveHeader color={MAIN_COLOR} textAlign="center">
            MY STASH
          </CursiveHeader>
          <Text.SubHeader fontSize="1.4rem" backgroundColor="#d93dceba" fontWeight={600} margin={0}>
            {ownedSkillsList.length}/{totalSkills} SKILLS
          </Text.SubHeader>
          <img className="icon8-icon" src={assetsMap.icons.inventory} />
        </Row>
        <UserSkillpointsContainer
          backgroundColor="#00000099"
          borderRadius="5px"
          minHeight="300px"
          textAlign={'center'}
          padding="1.5rem"
        >
          {!ownedSkillsList?.length ? (
            <Text.LargeHeader color={MAIN_COLOR} fontSize={'35px'} fontWeight={100}>
              :[ it's dangerous out there alone!
            </Text.LargeHeader>
          ) : (
            ownedSkillsList.map(({ skillId }) => {
              const skill = skillId ? getSkill(skillId) : null
              return (
                skill && (
                  <Row key={skillId} justifyContent="center" alignItems="center">
                    <Skillpoint metadata={skill} hasSkill />
                  </Row>
                )
              )
            })
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

  img.icon8-icon {
    max-width: 6rem;
    margin-left: auto;
  }

  ${() => upToSmall`
   img.icon8-icon {
    max-width: 6rem;
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
  gap: 0.25rem;
  padding: 1rem;

  > ${Row} {
    flex: 0 1 25%;
    justify-content: center;
    align-items: center;
  }
`
