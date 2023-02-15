import { ipfsToImageUri } from '../utils'
import { Row, AutoRow, ExternalLink, Text, Column } from '@past3lle/components'
import { upToSmall } from '@past3lle/theme'
import { ThemedButtonExternalLink } from 'components/Button'
import { SidePanel } from 'components/SidePanel'
import { MonospaceText } from 'components/Text'
import React from 'react'
import { useSkillsAtom } from 'state/Skills'
import styled from 'styled-components/macro'
import { CUSTOM_THEME } from 'theme/customTheme'

export function ActiveSkillPanel() {
  const [skillState, setSkillState] = useSkillsAtom()

  if (!skillState.active) return null
  const activeSkill = skillState.vectorsMap[skillState.active].skill
  return (
    <SidePanel
      header={activeSkill?.name || 'Unknown'}
      onDismiss={() => setSkillState((state) => ({ ...state, active: undefined }))}
    >
      <ActiveSkillPanelContainer>
        <Row justifyContent={'center'} margin="0 0 13% 0">
          <Text.SubHeader fontSize={'2.5rem'} fontWeight={200}>
            Buy {activeSkill?.name} and receive a free NFT skillpoint giving you access to exclusive perks.
          </Text.SubHeader>
        </Row>
        <Row
          id="skill-image-and-store-button"
          justifyContent={'space-around'}
          marginBottom="auto"
          flexWrap={'wrap'}
          gap="1rem"
        >
          {activeSkill?.image && <img src={ipfsToImageUri(activeSkill.image)} style={{ maxWidth: '40%' }} />}
          <ThemedButtonExternalLink href={`https://pastelle.shop/#/collection/${activeSkill?.name?.toLowerCase()}`}>
            <Text.Black fontWeight={300}>VIEW IN STORE</Text.Black>
          </ThemedButtonExternalLink>
        </Row>
        <AutoRow>
          <MonospaceText>
            View on{' '}
            <ExternalLink href="#">
              {' '}
              <strong style={{ color: CUSTOM_THEME.mainBg }}>OpenSea</strong>{' '}
            </ExternalLink>{' '}
          </MonospaceText>
        </AutoRow>
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

const ActiveSkillPanelContainer = styled(Column).attrs({})`
  height: 100%;
  ${Row}#skill-image-and-store-button {
    > img {
      max-width: 40%;
    }
    > ${ThemedButtonExternalLink} {
      padding: 2rem;
      > * {
        font-size: 2rem;

        ${upToSmall`
          font-size: 1.8rem;
        `}
      }
    }
  }
`
