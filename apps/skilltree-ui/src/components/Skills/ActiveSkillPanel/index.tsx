import { ActiveSkillContainer } from './styleds'
import { Row, AutoRow, ExternalLink, Text } from '@past3lle/components'
import { ThemedButtonExternalLink } from 'components/Button'
import { CursiveHeader, MonospaceText } from 'components/Text'
import React from 'react'
import { SkillsState, useSkillsAtom } from 'state/Skills'
import { CUSTOM_THEME } from 'theme/customTheme'

export function ActiveSkillPanel({
  skillState,
  setSkillState,
}: {
  skillState: SkillsState
  setSkillState: ReturnType<typeof useSkillsAtom>[1]
}) {
  if (!skillState.active) return null
  const activeSkill = skillState.vectorsMap[skillState.active].skill
  return (
    <ActiveSkillContainer>
      <div
        onClick={() => setSkillState((state) => ({ ...state, active: undefined }))}
        style={{ position: 'absolute', right: 15, top: 10, fontWeight: 300, fontSize: '3rem', cursor: 'pointer' }}
      >
        x
      </div>
      <Row>
        <CursiveHeader marginBottom="4rem" justifyContent={'center'}>
          {activeSkill?.name}
        </CursiveHeader>
      </Row>
      <Row justifyContent={'center'} margin="0 0 13% 0">
        <MonospaceText>
          Buy {activeSkill?.name} and receive a free NFT skillpoint giving you access to exclusive perks.
        </MonospaceText>
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
    </ActiveSkillContainer>
  )
}
