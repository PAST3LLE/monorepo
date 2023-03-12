import React, { useEffect } from 'react'

import { CookieBanner, CookieProps } from './index'

const KEY = '123_KEY'

function CookiesFixture(props: CookieProps) {
  useEffect(() => {
    localStorage.removeItem(KEY)
  }, [])

  return <CookieBanner {...props} />
}

export default {
  default: (
    <CookiesFixture
      storageKey={KEY}
      message={'THIS IS A COOKIE MESSAGE'}
      fullText={'THIS IS A COOKIE FULL TEXT FULL OF STUFF THAT IS FULL TO THE FULLING FULL.'}
      onAcceptAdvertising={() => alert('ADVERTISING ACCEPTED')}
      onAcceptAnalytics={() => alert('ANALYTICS ACCEPTED')}
      onAcceptMarketing={() => alert('MARKETING ACCEPTED')}
      onSaveAndClose={() => alert('MODAL SAVE AND CLOSE ')}
    />
  )
}
