import { ColumnCenter, Text } from '@past3lle/components'
import * as React from 'react'
import { BoxProps } from 'rebass'
import styled from 'styled-components'

import { MOCK_DATA } from '../../../mock/metadata'
import { Skillpoint } from '../Skillpoint'

const SkillpointHeader = styled(Text.SubHeader).attrs({ fontSize: '6rem', margin: 0, padding: 0 })`
  font-family: 'Goth';
  font-weight: 900;
  color: ${({ theme }) => theme.mainBg};
  margin: 0;
  padding: 0;
`

export function SkillColumn(props: { header: string } & BoxProps) {
  const collectionUri = MOCK_DATA.uri
  return (
    <ColumnCenter height="100%" justifyContent={'space-between'} {...props}>
      <SkillpointHeader>{props.header}</SkillpointHeader>
      {MOCK_DATA.skills.map((skill) => (
        <Skillpoint key={skill.id} collectionUri={collectionUri} {...skill} />
      ))}
    </ColumnCenter>
  )
}
