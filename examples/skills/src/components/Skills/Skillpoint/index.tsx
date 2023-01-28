import { Row } from '@past3lle/components'
import * as React from 'react'
import styled from 'styled-components'

import { GATEWAY_URI } from '../../../constants/ipfs'
import { SkillMetadata } from '../types'
import { getHash } from '../utils'

const StyedSkillpoint = styled(Row)`
  cursor: pointer;
`
export function Skillpoint(metadata: SkillMetadata) {
  const formattedUri = getHash(metadata.image)

  return (
    <StyedSkillpoint backgroundColor={'ghostwhite'} width="10vh" height="10vh" padding="3px">
      {formattedUri ? <img src={`${GATEWAY_URI}/${formattedUri}`} style={{ maxWidth: '100%' }} /> : <h1>Loading...</h1>}
    </StyedSkillpoint>
  )
}
