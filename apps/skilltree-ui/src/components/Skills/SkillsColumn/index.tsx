import { ColumnCenter, Text, VideoDelayer } from '@past3lle/components'
import { Skillpoint } from 'components/Skills/Skillpoint'
import { StyledSkillpoint } from 'components/Skills/common'
import { SkillMetadata } from 'components/Skills/types'
import { ThemedHeader } from 'components/Text'
import React from 'react'
import { BoxProps } from 'rebass'
import styled from 'styled-components/macro'

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

  const isEmpty = !skills.length
  const data = !isEmpty ? skills : (Array.from({ length: 6 }) as SkillMetadata[])

  return (
    <StyledSkillColumnWrapper {...boxProps}>
      {header && <SkillpointHeader>{header}</SkillpointHeader>}
      {data.map((skill, idx) =>
        !isEmpty ? (
          <Skillpoint key={skill.image} {...skill} />
        ) : (
          <StyledSkillpoint active={false} key={idx} backgroundColor="#4a484e57">
            <VideoDelayer $zIndex={100} />
            <ThemedHeader fontSize="1.2rem" letterSpacing={0} padding="0.5rem">
              LOADING
            </ThemedHeader>
          </StyledSkillpoint>
        )
      )}
    </StyledSkillColumnWrapper>
  )
}
