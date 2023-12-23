import { Column, Row, RowCenter } from '@past3lle/components'
import { SkillId } from '@past3lle/forge-web3'
import { fromLarge, upToSmall } from '@past3lle/theme'
import styled from 'styled-components'

import { ForgeFlowState } from '../../../state/Flows'
import { BlackHeader, CursiveMonoHeader, MonospaceText } from '../../Common/Text'
import { UserConnectionStats } from '../../Web3/UserWeb3ConnectionStats'

const FONT_COLOUR_HEADER = 'gainsboro'
const FONT_COLOUR_RESPONSE = 'ghostwhite'

export const FlowSkillImageCircle = styled.img<{ borderRadius?: string; maxWidth?: string }>`
  border-radius: ${({ borderRadius = '100%' }) => borderRadius};
  max-width: ${({ maxWidth = '100%' }) => maxWidth};
`
export const FlowRow = styled(RowCenter).attrs({
  borderRadius: '5px',
  width: '100%',
  gap: '1.5rem',
  padding: '1.2rem 1.4rem'
})<{ background?: string }>``

export const FlowCard = styled(FlowRow)<{ status: ForgeFlowState[number][SkillId]['status'] }>`
  background: ${(props) => `linear-gradient(45deg, ${_statusToColour(props.status)}, transparent)`};
  padding: 1.5rem 2rem;
`

export const SubSkillRow = styled(Row).attrs({
  alignItems: 'center',
  justifyContent: 'space-between',
  lineHeight: 1
})``

export const UpgradingSkillColumn = styled(Column).attrs({
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '6px 1.25rem',
  flexWrap: 'wrap',
  lineHeight: 0.8
})``

export const UpgradingSkillHeader = styled(BlackHeader).attrs({
  color: FONT_COLOUR_HEADER,
  padding: '0',
  fontWeight: 800,
  letterSpacing: '-1.5px'
})`
  font-size: 2.2rem;

  ${fromLarge`
    font-size: 1.9vw;
  `}
`

export const UpgradingSkillHeaderResponse = styled(BlackHeader).attrs({
  color: FONT_COLOUR_RESPONSE,
  padding: '0',
  fontWeight: 100,
  letterSpacing: '-1.2px'
})`
  font-size: 2.5rem;

  ${fromLarge`
    font-size: 2.1vw;
  `}
`

export const SubSkillHeader = styled(BlackHeader).attrs({
  fontWeight: 800,
  padding: 0
})`
  font-size: 1.7rem;

  ${fromLarge`
    font-size: 1.4vw;
  `}
`

export const SubSkillHeaderResponse = styled(BlackHeader).attrs({
  fontWeight: 100,
  padding: 0,
  fontFamily: 'monospace'
})`
  font-size: 1.55rem;

  ${fromLarge`
    font-size: 1.3vw;
  `}
`

export const SkillFlowsContainer = styled(Column)`
  overflow: hidden;
  height: 100%;
  padding: 2rem 0 0;

  img.icon8-icon {
    max-width: 6rem;
    margin-left: auto;
  }

  ${() => upToSmall`
   img.icon8-icon {
    max-width: 6rem;
   }

    ${CursiveMonoHeader} > * {
      font-size: 2.4rem;
    }
    
    ${UserConnectionStats} {
      padding: 1.4rem 1rem 1.4rem 1.4rem;
      gap: 0.75rem;
      border-radius: 0;
      > ${MonospaceText} {
        font-size: 1.5rem;
      }
    }
  `}
`

export const UserSkillpointsContainer = styled(Column)`
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  gap: 1.5rem;
  padding: 0rem;

  > ${Row} {
    flex: 1;
    justify-content: center;
    align-items: center;
  }
`

function _statusToColour(status: ForgeFlowState[number][SkillId]['status']) {
  switch (status) {
    case 'claimed':
      return '#2eb97b'
    case 'needs-approvals':
      return '#af5555'
    case 'approved':
      return '#8275c4'
    case 'claimable':
      return '#195ac1'
    default:
      return 'black'
  }
}
