import { Skillpoint } from '../Skillpoint'
import { SkillpointHeader } from '../common'
import { Column, Row } from '@past3lle/components'
import {
  PSTLAllCollections__factory,
  /* PSTLCollectionBaseSkills__factory */
} from '@past3lle/skilltree-contracts'
import { convertToRomanNumerals } from '@past3lle/utils'
import { LightningCanvas } from 'components/Canvas'
import { toggleSelectedSkill } from 'components/Canvas/api/hooks'
import { Vector } from 'components/Canvas/api/vector'
// import { BigNumber } from 'ethers'
import React from 'react'
import { useSkillsAtom } from 'state/Skills'
import { useContractRead } from 'wagmi'
import { useSkillsContract } from 'web3/hooks/skills/useSkillsContract'
import { useContractAddressesByChain } from 'web3/hooks/useContractAddress'

export function SkillsCanvas() {
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

  const { read: skillsContractRead } = useSkillsContract()
  for (let i = 1; i <= collectionsAmt; i++) {
    // get SkillURI for collection 1
    skillsContractRead.getUri(i)
  }

  const [state] = useSkillsAtom()
  const { vectors, metadata } = state

  return (
    <Column height={'100%'} style={{ position: 'relative' }}>
      <Row width={'100%'} height={'12vh'} justifyContent="space-between" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {vectors.slice(0, metadata.length).map(({ vector }, idx) => {
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
      <Column height={'100%'} style={{ position: 'relative' }} id="CANVAS-CONTAINER">
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {vectors.map(({ skill, vector }) => {
            if (!skill) return null
            return (
              <Skillpoint
                key={skill.properties.id}
                metadata={skill}
                vector={vector}
                lightupDependencies={(state) => toggleSelectedSkill(skill.properties.id, state)}
              />
            )
          })}
        </div>
        {/* CANVAS */}
        <LightningCanvas />
      </Column>
    </Column>
  )
}
