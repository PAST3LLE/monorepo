import { RowProps } from '@past3lle/components'
import { ForgeBalances, ForgeMetadataState, SkillDependencyObject, SkillId } from '@past3lle/forge-web3'
import React from 'react'

import { Skillpoint } from '../../Skillpoint'
import { SkillsRowContainer } from '../ActiveSkillPanel/styleds'

export interface SkillsRowProps {
  deps: SkillDependencyObject[]
  metadataMap: ForgeMetadataState['metadataMap'][number]
  balances: ForgeBalances[number]
  rowProps?: RowProps
}
export function SkillsRow({ balances, deps, metadataMap, rowProps }: SkillsRowProps) {
  return (
    <SkillsRowContainer padding="1rem" gap="0 1.7rem" overflowX={'auto'} {...rowProps}>
      {/* 
        // TODO: review - right now disabled as not required in contracts
        <SkillpointPoint />
        <Row justifyContent={'center'} width="auto" minWidth={'2rem'} fontSize={'4rem'} fontWeight={100}>
          +
        </Row> */}
      {deps.flatMap(({ token, id }) => {
        const skillId: SkillId = `${token}-${id}`
        const skill = metadataMap[skillId]
        return (
          skill && (
            <Skillpoint
              key={skill.properties.id}
              // @ts-ignore
              title={skill.name}
              hasSkill={BigInt(balances?.[skillId] || 0) > BigInt(0)}
              metadata={skill}
              skillpointStyles={{ css: 'box-shadow: unset;' }}
            />
          )
        )
      })}
    </SkillsRowContainer>
  )
}
