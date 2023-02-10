import { Row, AutoRow, ExternalLink, Text } from '@past3lle/components'
import { ThemedButtonExternalLink } from 'components/Button'
import { SidePanel } from 'components/SidePanel'
import { MonospaceText } from 'components/Text'
import React from 'react'
import { useSkillsAtom } from 'state/Skills'
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
      <Row justifyContent={'center'} margin="0 0 13% 0">
        <Text.SubHeader fontSize={'2.5rem'} fontWeight={200}>
          Buy {activeSkill?.name} and receive a free NFT skillpoint giving you access to exclusive perks.
        </Text.SubHeader>
      </Row>
      <Row justifyContent={'flex-end'} marginBottom="auto">
        <ThemedButtonExternalLink href={`https://pastelle.shop/#/collection/${activeSkill?.name?.toLowerCase()}`}>
          <Text.Black fontSize={'2rem'} fontWeight={300}>
            VIEW IN STORE
          </Text.Black>
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
      <AutoRow>
        <MonospaceText>Connect Wallet</MonospaceText>
      </AutoRow>
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
    </SidePanel>
  )
}
