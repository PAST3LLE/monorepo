import * as StyledElems from '../styleds'
import { ContactContent } from './Contact'
import {
  Button,
  ButtonSizeVariations,
  ButtonVariations,
  ColumnCenter,
  RowCenter,
  SmartImg,
  Text
} from '@past3lle/components'
import { useIsMobile } from '@past3lle/hooks'
import { upToSmall, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import SkillForgeUnlockabled from 'assets/png/skillforge-unlockable.png'
import { PastelleLabsHeader } from 'components/Header'
import React from 'react'
import { BoxProps } from 'rebass'
import styled from 'styled-components/macro'

const AboutContentWrapper = styled(RowCenter)`
  align-items: flex-start;
  flex-wrap: wrap;

  ${upToSmall`
    align-items: center;
    flex-flow: column;

    > ${Text.SubHeader} {
      max-width: unset;
      width: 100%;
    }

    > ${ColumnCenter} {
      width: 100%;
      flex: unset;
      height: 50%;
    }
    > ${Text.SubHeader} {
      font-size: 2rem;
    }
  `}
`

export function About(props: BoxProps) {
  const isMobile = useIsMobile()
  return (
    <StyledElems.SplashWrapper {...props}>
      <PastelleLabsHeader />
      <AboutContentWrapper width="100%">
        <Text.SubHeader fontWeight={300} padding="2rem" maxWidth="40%">
          We are a team of experienced Web3 developers and entrepreneurs utilising this loyalty system for our own
          streetwear label, PASTELLE APPAREL.
          <br />
          <br />
          Check out how PASTELLE APPAREL has integrated its Web3-enabled rewards program by visiting PASTELLE's
          SkillForge interface or read about other examples in our blog!
        </Text.SubHeader>
        <ColumnCenter width="50%">
          <SmartImg
            path={{ defaultPath: SkillForgeUnlockabled }}
            pathSrcSet={urlToSimpleGenericImageSrcSet(SkillForgeUnlockabled)}
          />
          <a
            href="https://skills.pastelle.shop"
            target="_blank"
            style={{ filter: 'invert(1)', letterSpacing: -1.5, fontStyle: 'italic' }}
          >
            <Button buttonSize={ButtonSizeVariations.BIG} buttonVariant={ButtonVariations.SECONDARY} marginTop="2rem">
              VISIT SKILLFORGE
            </Button>
          </a>
        </ColumnCenter>
      </AboutContentWrapper>
      {!isMobile && <ContactContent />}
    </StyledElems.SplashWrapper>
  )
}
