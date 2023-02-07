import { Skillpoint } from '../Skillpoint'
import { SkillpointHeader } from '../common'
import { Column, Row } from '@past3lle/components'
import { useStateRef } from '@past3lle/hooks'
import {
  PSTLAllCollections__factory,
  /* PSTLCollectionBaseSkills__factory */
} from '@past3lle/skilltree-contracts'
import { convertToRomanNumerals } from '@past3lle/utils'
import { LightningCanvas } from 'components/Canvas'
import { calculateGridPoints } from 'components/Canvas/api/hooks'
import { Vector } from 'components/Canvas/api/vector'
import { useMetadata } from 'components/Skills/hooks'
// import { BigNumber } from 'ethers'
import React, { useMemo } from 'react'
import { useGetWindowSize } from 'state/WindowSize'
import { useContractRead } from 'wagmi'
import { useSkillsContract } from 'web3/hooks/skills/useSkillsContract'
import { useContractAddressesByChain } from 'web3/hooks/useContractAddress'

/* const SkilltreeCanvasGrid = styled(Row)<{ gridTemplateAreas: string }>`
  position: relative;
  padding: 2rem;
  height: 100%;

  display: grid;
  justify-content: space-around;
  justify-items: center;
  grid-template-areas: ${({ gridTemplateAreas }) => gridTemplateAreas};
` */

export function SkillsCanvas() {
  const metadata = useMetadata()
  const { skillsMetadata = [] } = metadata

  const { collections /* , skills */ } = useContractAddressesByChain()

  const { data: supplyBn } = useContractRead({
    abi: PSTLAllCollections__factory.abi,
    functionName: 'totalSupply',
    address: collections,
  })
  const collectionsAmt = supplyBn?.toNumber() || 0
  // read skills collection ID && pass to "getSkillsAddress" in collections contract
  // const { data: skillAddress } = useContractRead({
  //   abi: PSTLAllCollections__factory.abi,
  //   functionName: 'getSkillsAddress',
  //   args: [BigNumber.from(1)],
  //   address: collections,
  // })

  // // get SkillURI for collection 1
  // const { data: uri, refetch } = useContractRead({
  //   abi: PSTLCollectionBaseSkills__factory.abi,
  //   functionName: 'uri',
  //   args: [BigNumber.from(1)],
  //   address: skills[1],
  // })

  // console.log('SKILL URI =>', skillAddress, uri, collectionsAmt)
  // console.log('SKILL URI2 =>', skillAddress, refetch())

  const { read: skillsContractRead } = useSkillsContract()
  for (let i = 1; i <= collectionsAmt; i++) {
    // get SkillURI for collection 1
    skillsContractRead.getUri(i)
  }

  const [ref, setContainerRef] = useStateRef(null, (node) => node)

  // TODO: export COLLECTIONS721 metadata
  // Skill ID in contract corresponds to position in grid, e.g Collection 2 has 2 skills with IDs 1000 and 4000, respectively
  // Meaning they will get grid positions skill2_1 and skill2_4, respectively
  const [windowSizeState] = useGetWindowSize()
  const skillGridPosition = useMemo(
    () => (ref ? calculateGridPoints(skillsMetadata, ref) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [skillsMetadata, windowSizeState.height, windowSizeState.width]
  )

  return (
    <Column padding="2rem" height={'100%'} style={{ position: 'relative' }}>
      <Row width={'100%'} height={'10rem'} justifyContent="space-between" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {skillGridPosition.slice(0, skillsMetadata.length).map(({ vector }, idx) => {
            const idxToRoman = convertToRomanNumerals(idx + 1)
            if (!vector) return null
            return (
              <SkillpointHeader key={idx} vector={new Vector(vector.X, vector.Y, vector.X1, 0)}>
                {idxToRoman}
              </SkillpointHeader>
            )
          })}
        </div>
      </Row>
      <Column height={'100%'} style={{ position: 'relative' }} ref={setContainerRef}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {skillGridPosition.map(({ skill, vector }) => {
            if (!skill) return null
            return <Skillpoint key={skill.properties.id} metadata={skill} vector={vector} />
          })}
        </div>
        {/* CANVAS */}
        <LightningCanvas />
      </Column>
    </Column>
  )
}
