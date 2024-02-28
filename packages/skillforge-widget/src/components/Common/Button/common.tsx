import { Button, ButtonProps, StyledLink } from '@past3lle/components'
import { useForgeWindowSizeAtom } from '@past3lle/forge-web3'
import { MEDIA_WIDTHS, MediaWidths, setCssBackground } from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'
import React from 'react'
import styled, { css } from 'styled-components'

import { MAIN_BG, MAIN_FG } from '../../../theme/constants'
import { useAssetsMap } from '../../../theme/utils'
import { CursiveMonoHeader, CursiveMonoHeaderProps, MonospaceText } from '../Text'

export const ThemedButton = styled(Button).attrs(() => ({}))<{
  invert?: boolean
  gap?: string
  bgImage?: GenericImageSrcSet<MediaWidths>
  bgColor?: string
  bgBlendMode?: 'hard-light' | 'difference' | 'exclusion' | 'color-burn' | 'darken' | 'unset'
}>`
  background-color: ${({ theme, bgColor = theme.mainBg }) => bgColor};
  box-shadow: 4px 4px 1px 0px #000000bd;
  padding: 0rem 1rem;
  ${({ invert, theme, bgImage }) =>
    invert &&
    !bgImage &&
    `
      background-color: ${theme.mainText};
      > * { filter: invert(1); }
    `}
  ${({ gap }) => gap && `gap: ${gap};`}
    ${({ theme, bgColor = 'transparent', bgImage, bgBlendMode = 'difference' }) =>
    bgImage &&
    css`
      ${setCssBackground(theme, {
        imageUrls: [bgImage],
        backgroundColor: bgColor,
        backgroundBlendMode: bgBlendMode
      })}
    `}
  
      &:hover {
    box-shadow: 0px 0px 1px black;
    transform: translate(4px, 4px);
  }

  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
`

export const ThemedButtonExternalLink = styled(StyledLink).attrs({
  minWidth: 200
})<{
  disabled?: boolean
  fontSize?: string
  fullWidth?: boolean
}>`
  z-index: 1;
  padding: 1rem 2rem;
  flex: 1;
  text-align: center;
  ${({ fontSize }) => fontSize && `font-size: ${fontSize};`}
  background-color: ${({ theme, disabled }) => (disabled ? theme.rarity.common.backgroundColor : theme.mainBg)};
  ${({ fullWidth }) => fullWidth && `width: 100%;`}

  ${({ disabled }) =>
    disabled &&
    ` 
        text-decoration: none;
        &:hover {
          text-decoration: none;
        } 
    `}
`

export const ThemedButtonActions = styled(ThemedButton).attrs({
  minWidth: 200
})`
  padding: 1rem 2rem;
  flex: 1;
  z-index: 1;
  text-align: center;
  box-shadow: none;
  border-radius: none;
  background-color: ${({ theme, disabled }) => (disabled ? theme.rarity.common.backgroundColor : theme.mainBg)};
  ${({ disabled }) =>
    disabled &&
    ` 
        text-decoration: none;
        &:hover {
          text-decoration: none;
        } 
    `}
`

const strobeAnimation = css`
  @keyframes strobeInvert {
    0% {
      filter: invert(0) hue-rotate(0deg);
    }
    50% {
      filter: invert(1) hue-rotate(225deg);
    }
    100% {
      filter: invert(0) hue-rotate(0deg);
    }
  }
`

export const StyledHeaderButton = styled(ThemedButton).attrs(
  ({
    bgColor = 'black',
    bgImage,
    height,
    showFlexRow,
    title
  }: Pick<HeaderButtonProps, 'title' | 'bgImage'> & { bgColor?: string; height?: string; showFlexRow: boolean }) => ({
    bgColor,
    bgImage: bgImage ?? undefined,
    bgBlendMode: 'hard-light',
    title,
    display: 'flex',
    flexDirection: showFlexRow ? 'row' : 'row-reverse',
    alignItems: 'center',
    gap: '0 0.5rem',
    height: height || '80%'
  })
)<{ animate?: boolean }>`
  ${strobeAnimation}

  animation-name: ${({ animate }) => (animate ? 'strobeInvert' : '')};
  animation-duration: 5s;
  animation-iteration-count: ${({ animate }) => (animate ? 'Infinite' : 0)};
  filter: invert(0);
`

export interface HeaderButtonProps {
  bgColor?: string
  bgImage: GenericImageSrcSet<MediaWidths> | null
  capitalLetterProps?: CursiveMonoHeaderProps['capitalLetterProps']
  restWordProps?: CursiveMonoHeaderProps['restWordProps']
  fullHeader: string
  shortHeader?: string
  iconKey: keyof Omit<ReturnType<typeof useAssetsMap>['icons'], 'chains' | 'rarity'>
  title?: string
  className?: string
  animate?: boolean
  onClick?: () => void
}
export function HeaderButton({
  bgColor,
  bgImage,
  fullHeader,
  shortHeader,
  capitalLetterProps,
  restWordProps,
  className,
  title,
  iconKey,
  animate,
  onClick,
  ...buttonProps
}: HeaderButtonProps & Omit<ButtonProps, 'bgImage'>) {
  const assetsMap = useAssetsMap()

  const [{ width = 0 }] = useForgeWindowSizeAtom()
  const showShortLogo = width > MEDIA_WIDTHS.upToSmall && width < MEDIA_WIDTHS.upToMedium
  return (
    <StyledHeaderButton
      className={className}
      bgColor={bgColor}
      bgImage={bgImage}
      showFlexRow={width > MEDIA_WIDTHS.upToSmall}
      title={title}
      animate={animate}
      {...buttonProps}
      onClick={onClick}
    >
      {width > MEDIA_WIDTHS.upToSmall ? (
        <CursiveMonoHeader
          text={showShortLogo ? shortHeader || fullHeader : fullHeader}
          capitalLetterProps={{
            display: 'inline-flex',
            alignItems: 'center',
            color: MAIN_BG,
            fontSize: '4rem',
            zIndex: 3,
            ...capitalLetterProps
          }}
          restWordProps={{
            zIndex: -1,
            marginLeft: '-0.2rem',
            margin: '0 0 0.2rem -0.4rem',
            color: '#ebebe9e3',
            fontFamily: 'monospace',
            fontSize: '1.8rem',
            letterSpacing: '-1.4px',
            fontStyle: 'normal',
            fontWeight: 300,
            ...restWordProps
          }}
        />
      ) : (
        <MonospaceText color={MAIN_FG} fontSize="1.05rem" marginLeft="-0.2rem">
          {shortHeader || fullHeader}
        </MonospaceText>
      )}
      {assetsMap.icons?.[iconKey] && (
        <img
          src={assetsMap.icons[iconKey]}
          style={{ maxWidth: width > MEDIA_WIDTHS.upToSmall ? '2.3rem' : '2.8rem' }}
        />
      )}
    </StyledHeaderButton>
  )
}
