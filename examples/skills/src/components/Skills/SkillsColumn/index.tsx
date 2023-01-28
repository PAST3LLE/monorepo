import { ColumnCenter, Text } from '@past3lle/components'
import * as React from 'react'
import { BoxProps } from 'rebass'
import styled from 'styled-components'

import { Skillpoint } from '../Skillpoint'
import { SkillMetadata } from '../types'

const SkillpointHeader = styled(Text.SubHeader).attrs({ fontSize: '6rem', margin: 0, padding: 0 })`
  font-family: 'Goth';
  font-weight: 900;
  color: ${({ theme }) => theme.mainBg};
  margin: 0;
  padding: 0;
`

const StyledSkillColumnWrapper = styled(ColumnCenter).attrs({ margin: 'auto' })`
  height: 100%;
  justify-content: space-between;
  width: auto;
  margin: auto;
  z-index: 1;
`

interface SkillColumnProps {
  header?: string
  boxProps?: BoxProps
  // metadata
  // collectionMetadataUri: string
  skills: SkillMetadata[]
}
export function SkillColumn(props: SkillColumnProps) {
  const { skills, header, boxProps } = props
  return (
    <StyledSkillColumnWrapper {...boxProps}>
      {header && <SkillpointHeader>{header}</SkillpointHeader>}
      {skills.map((skill) => (
        <Skillpoint key={skill.image} {...skill} />
      ))}
    </StyledSkillColumnWrapper>
  )
}
