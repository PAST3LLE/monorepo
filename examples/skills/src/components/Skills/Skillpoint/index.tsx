import { Row } from '@past3lle/components'
import * as React from 'react'
import styled from 'styled-components'

import { GATEWAY_URI } from '../../../constants/ipfs'
import { SkillpointProps } from '../types'
import { getHash, getTokenUri } from '../utils'

const StyedSkillpoint = styled(Row)`
  cursor: pointer;
`
export function Skillpoint({ id, collectionUri }: SkillpointProps) {
  const [tokenUri, setTokenUri] = React.useState<string | null>(null)
  React.useEffect(() => {
    const hash = getHash(collectionUri)
    const skillJSONUri = `${GATEWAY_URI}/${hash}/${id}.json`

    getTokenUri(skillJSONUri).then((res) => setTokenUri(res))
  }, [id, collectionUri])

  return (
    <StyedSkillpoint backgroundColor={'ghostwhite'} width="80px" height="80px" padding="3px">
      {tokenUri ? <img src={tokenUri} style={{ maxWidth: '100%' }} /> : <h1>Loading...</h1>}
    </StyedSkillpoint>
  )
}
