import { Column } from '@past3lle/components'
import styled from 'styled-components'

import { AccountBottomColumnContainer } from '../AccountModal/styled'
import { ModalButton, WalletsWrapper } from '../common/styled'

export const HidModalContainer = styled(AccountBottomColumnContainer)`
  > ${Column}:first-child {
    flex: 0 1 100%;
  }
`

export const HidModalWalletsWrapper = styled(WalletsWrapper)`
  > div {
    > ${ModalButton} {
      background-color: ${(props) => props.theme?.modals?.account?.button?.['explorer']?.background?.background};
      height: 40px;
      flex-flow: row nowrap;
      > img,
      > svg {
        max-height: 80%;
      }
    }
  }
`
