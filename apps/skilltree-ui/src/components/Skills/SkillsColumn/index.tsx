import {
  /* ColumnCenter, */
  VideoDelayer,
} from '@past3lle/components'
import { Skillpoint } from 'components/Skills/Skillpoint'
import { StyledSkillpoint } from 'components/Skills/common'
import { SkillMetadata } from 'components/Skills/types'
import { ThemedHeader } from 'components/Text'
import React from 'react'
import { BoxProps } from 'rebass'

interface SkillColumnProps {
  header?: string
  boxProps?: BoxProps
  gridArea: string
  skills: SkillMetadata[]
}
export function SkillColumn(props: SkillColumnProps) {
  const { skills } = props

  const isEmpty = !skills.length
  const data = !isEmpty ? skills : (Array.from({ length: 6 }) as SkillMetadata[])

  return (
    <>
      {data.map((skill, idx) => {
        return !isEmpty ? (
          <Skillpoint key={skill.image} metadata={skill} />
        ) : (
          <StyledSkillpoint
            isDependency={false}
            rarity={undefined}
            active={false}
            key={idx}
            backgroundColor="#4a484e57"
          >
            <VideoDelayer $zIndex={100} />
            <ThemedHeader fontSize="1.2rem" letterSpacing={0} padding="0.5rem">
              LOADING
            </ThemedHeader>
          </StyledSkillpoint>
        )
      })}
    </>
  )
}
