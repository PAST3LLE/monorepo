import { Column } from '@past3lle/components'
import { MonospaceText } from 'components/Text'
import styled from 'styled-components/macro'

export const ActiveSkillContainer = styled(Column)`
  // position: fixed;
  position: relative;
  z-index: 999;
  background: lightgrey;
  // width: 60%;
  // width: 40%;
  // border-radius: 5px;

  // top: 2rem;
  // bottom: 2rem;
  // right: 2rem;
  padding: 4rem;

  ${MonospaceText} {
    font-size: 2rem;
    font-style: italic;
    text-align: left;
  }
`
