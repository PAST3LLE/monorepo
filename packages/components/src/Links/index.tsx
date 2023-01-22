import { devDebug } from '@past3lle/utils'
import React, { HTMLProps, useCallback } from 'react'
import { ArrowLeft } from 'react-feather'
import ReactGA from 'react-ga'
import { HashLink } from 'react-router-hash-link'

import { LinkStyledButton as ButtonLink, StyledBackArrowLink, StyledLink } from './styleds'

export interface LinkRendererProps {
  href: string
  children: React.ReactNode
  smooth?: boolean
  scroll?: ((element: HTMLElement) => void) | undefined
}

/**
 * Outbound link that handles firing google analytics events
 */
function ExternalLink({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & { href: string }) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
        ReactGA.outboundLink({ label: href }, () => {
          devDebug('Fired outbound link event', href)
        })
      } else {
        event.preventDefault()
        // send a ReactGA event and then trigger a location change
        ReactGA.outboundLink({ label: href }, () => {
          window.location.href = href
        })
      }
    },
    [href, target]
  )
  return <StyledLink target={target} rel={rel} href={href} onClick={handleClick} {...rest} />
}

function BackArrowLink({ to }: { to: string }) {
  return (
    <StyledBackArrowLink to={to}>
      <ArrowLeft />
    </StyledBackArrowLink>
  )
}

function Link(props: LinkRendererProps) {
  const { children, href = '#', smooth, scroll } = props
  const isExternalLink = /^(https?:)?\/\//.test(href)
  return isExternalLink ? (
    <ExternalLink href={href}>{children}</ExternalLink>
  ) : (
    <HashLink smooth={smooth} to={href} scroll={scroll}>
      {children}
    </HashLink>
  )
}

const SCROLL_OFFSET = 24
function ScrollableLink(props: LinkRendererProps): JSX.Element {
  const { children, smooth = true, ...otherProps } = props

  const scrollWithOffset = (el: HTMLElement) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({ top: yCoordinate - SCROLL_OFFSET, behavior: 'smooth' })
  }

  return (
    <Link smooth={smooth} {...otherProps} scroll={scrollWithOffset}>
      {children}
    </Link>
  )
}

export { ExternalLink, BackArrowLink, ButtonLink, Link, ScrollableLink }
