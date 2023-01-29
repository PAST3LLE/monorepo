import sprayBg from '../../../assets/png/spray.png'
import { GATEWAY_URI } from '../../../constants/ipfs'
import { useSkillsAtom } from '../../../state/Skills'
import { StyledSkillpoint } from '../common'
import { SkillMetadata } from '../types'
import { getHash } from '../utils'
import styled from 'styled-components'

export function Skillpoint(metadata: SkillMetadata) {
  const [state, setSkillState] = useSkillsAtom()
  const formattedUri = getHash(metadata.image)

  const isActive = metadata.image === state.active

  const handleClick = () =>
    setSkillState((state) => ({
      ...state,
      active: state.active === metadata.image ? undefined : metadata.image,
    }))

  return (
    <StyledSkillpoint active={isActive} backgroundColor={'ghostwhite'} onClick={handleClick}>
      {formattedUri ? <img src={`${GATEWAY_URI}/${formattedUri}`} style={{ maxWidth: '100%' }} /> : <h1>Loading...</h1>}
      {isActive && <SprayBg />}
    </StyledSkillpoint>
  )
}

const StyledImg = styled.img`
  z-index: -1;
  position: absolute;

  width: 280%;
  height: 280%;

  top: -100%;
  left: -76%;

  overflow-clip-margin: unset;
  max-inline-size: unset;
  max-block-size: unset;
`
const SprayBg = () => <StyledImg src={sprayBg} />
