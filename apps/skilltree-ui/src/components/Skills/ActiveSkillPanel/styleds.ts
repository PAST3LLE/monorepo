import { ArticleFadeIn } from '@past3lle/components'
import { MonospaceText } from 'components/Text'
import styled from 'styled-components/macro'

export const ActiveSkillContainer = styled(ArticleFadeIn)`
  display: flex;
  flex-flow: column nowrap;

  position: fixed;
  // position: relative;

  z-index: 999;

  background: lightgrey;

  // width: 60%;
  width: 40%;

  // border-radius: 5px;

  top: 0;
  bottom: 0;
  right: 0;
  padding: 4rem;

  ${MonospaceText} {
    font-size: 2rem;
    font-style: italic;
    text-align: left;
  }
`
