import { Column } from '@past3lle/components'
import styled from 'styled-components'

import { AccountBottomColumnContainer } from '../AccountModal/styled'

export const HidModalContainer = styled(AccountBottomColumnContainer)`
  > ${Column}:first-child {
    flex: 0 1 100%;
  }
`
