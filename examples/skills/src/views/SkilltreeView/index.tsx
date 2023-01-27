import { ArticleFadeIn, AutoRow, ColumnCenter, Header as HeaderPstl, Row, Text } from '@past3lle/components'
import * as React from 'react'
import { useEffect } from 'react'
import { BoxProps } from 'rebass'
import styled from 'styled-components'

import { BlackBoldItalic, BlackHeader } from '../../components/Text'
import { LightningCanvas } from '../../components/canvas'
import { GATEWAY_URI } from '../../constants/ipfs'

const Header = () => (
  <HeaderPstl>
    <Row gap="1rem">
      <BlackHeader>PASTELLE SKILLTREE</BlackHeader>
      <AutoRow display={'inline-flex'} backgroundColor={'ghostwhite'} padding={'1rem'}>
        <BlackBoldItalic fontSize={'1.5rem'}>
          VIEW CURRENT SKILLS AND ANY UPGRADABLES. HOVER OVER SKILL FOR MORE INFO.
        </BlackBoldItalic>
      </AutoRow>
    </Row>
  </HeaderPstl>
)

const StyledMain = styled(ArticleFadeIn)`
  // TOOD: remove - testing to see main boundaries
  margin: 2rem;
  background: rgba(0, 0, 0, 0.4);
`
const Main = () => (
  <StyledMain>
    <Row padding={'2rem'} height="100%">
      <SkillColumn header="i" /* alignItems="flex-start" */ />
      <SkillColumn header="ii" />
      <SkillColumn header="iii" /* alignItems="flex-end" */ />
    </Row>
    {/* CANVAS */}
    <LightningCanvas />
  </StyledMain>
)

export function SkilltreeView() {
  return (
    <>
      <Header />
      <Main />
    </>
  )
}

const SkillpointHeader = styled(Text.SubHeader).attrs({ fontSize: '6rem', margin: 0, padding: 0 })`
  font-family: 'Goth';
  font-weight: 900;
  color: ${({ theme }) => theme.mainBg};
  margin: 0;
  padding: 0;
`

function SkillColumn(props: { header: string } & BoxProps) {
  const collectionUri = MOCK_DATA.uri
  return (
    <ColumnCenter height="100%" justifyContent={'space-between'} {...props}>
      <SkillpointHeader>{props.header}</SkillpointHeader>
      {MOCK_DATA.skills.map((skill) => (
        <Skillpoint key={skill.id} uri={collectionUri} {...skill} />
      ))}
    </ColumnCenter>
  )
}

interface SkillpointProps {
  name: string
  id: string
  description: string
  uri: string
}
interface SkillMetadata {
  description: string
  name: string
  image: string
}

const getHash = (uri: string) => (uri.startsWith('ipfs://') ? uri.substring(7) : uri)

const StyedSkillpoint = styled(Row)`
  cursor: pointer;
`
function Skillpoint({ id, uri }: SkillpointProps) {
  const [tokenUri, setTokenUri] = React.useState<string | null>(null)
  useEffect(() => {
    const hash = getHash(uri)
    const skillJSONUri = `${GATEWAY_URI}/${hash}/${id}.json`

    async function getTokenUri() {
      const skillMetaData: SkillMetadata = await (await fetch(skillJSONUri)).json()
      const skillUriHash = getHash(skillMetaData.image)

      return `${GATEWAY_URI}/${skillUriHash}`
    }

    getTokenUri().then((res) => setTokenUri(res))
  }, [id, uri])

  return (
    <StyedSkillpoint backgroundColor={'ghostwhite'} width="8rem" height="8rem" padding="0.3rem">
      {tokenUri ? <img src={tokenUri} style={{ maxWidth: '100%' }} /> : <h1>Loading...</h1>}
    </StyedSkillpoint>
  )
}

const MOCK_DATA = {
  id: 0,
  name: 'GENE$IS',
  uri: 'ipfs://QmPf95AjYdgsTsZ9BcqqabYB4pdFgLoAQhnHN93UbDswio',
  skills: [
    {
      name: 'SKILL_1',
      id: '0000000000000000000000000000000000000000000000000000000000000000',
      description: 'Lorem ipsum in the butt'
    },
    {
      name: 'SKILL_2',
      id: '0000000000000000000000000000000000000000000000000000000000000001',
      description: 'Lorem ipsum in the weiner'
    },
    {
      name: 'SKILL_3',
      id: '0000000000000000000000000000000000000000000000000000000000000002',
      description: 'Lorem ipsum in the eye'
    },
    {
      name: 'SKILL_4',
      id: '0000000000000000000000000000000000000000000000000000000000000003',
      description: 'Lorem ipsum in the axe'
    },
    {
      name: 'SKILL_5',
      id: '0000000000000000000000000000000000000000000000000000000000000004',
      description: 'Lorem ipsum in the ear'
    },
    {
      name: 'SKILL_6',
      id: '0000000000000000000000000000000000000000000000000000000000000005',
      description: 'Lorem ipsum in the nut'
    }
  ]
}
