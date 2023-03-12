import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import React from 'react'

import { Button, ButtonSizeVariations, ButtonVariations } from './index'

const BG_IMAGE = 'https://pngimg.com/uploads/free/free_PNG90748.png'

export default {
  default: (
    <Button buttonSize={ButtonSizeVariations.DEFAULT} buttonVariant={ButtonVariations.DEFAULT}>
      DEFAULT BUTTON
    </Button>
  ),
  smallButton: (
    <Button buttonSize={ButtonSizeVariations.SMALL} buttonVariant={ButtonVariations.DEFAULT}>
      SMALL BUTTON
    </Button>
  ),
  largeButton: (
    <Button buttonSize={ButtonSizeVariations.BIG} buttonVariant={ButtonVariations.DEFAULT}>
      LARGE BUTTON
    </Button>
  ),
  primaryButton: (
    <Button buttonSize={ButtonSizeVariations.DEFAULT} buttonVariant={ButtonVariations.PRIMARY}>
      PRIMARY BUTTON
    </Button>
  ),
  secondaryButton: (
    <Button buttonSize={ButtonSizeVariations.DEFAULT} buttonVariant={ButtonVariations.SECONDARY}>
      SECONDARY BUTTON
    </Button>
  ),
  themeButton: (
    <Button
      buttonSize={ButtonSizeVariations.DEFAULT}
      buttonVariant={ButtonVariations.THEME}
      bgImage={urlToSimpleGenericImageSrcSet(BG_IMAGE)}
    >
      THEME BUTTON
    </Button>
  ),
  cancelButton: (
    <Button buttonSize={ButtonSizeVariations.DEFAULT} buttonVariant={ButtonVariations.CANCEL}>
      CANCEL BUTTON
    </Button>
  ),
  successButton: (
    <Button buttonSize={ButtonSizeVariations.DEFAULT} buttonVariant={ButtonVariations.SUCCESS}>
      SUCCESS BUTTON
    </Button>
  ),
  disabledButton: (
    <Button buttonSize={ButtonSizeVariations.DEFAULT} buttonVariant={ButtonVariations.DISABLED}>
      DISABLED BUTTON
    </Button>
  ),
  dangerButton: (
    <Button buttonSize={ButtonSizeVariations.DEFAULT} buttonVariant={ButtonVariations.DANGER}>
      DANGER BUTTON
    </Button>
  ),
  warningButton: (
    <Button buttonSize={ButtonSizeVariations.DEFAULT} buttonVariant={ButtonVariations.WARNING}>
      WARNING BUTTON
    </Button>
  ),
  darkModeButton: (
    <Button buttonSize={ButtonSizeVariations.DEFAULT} buttonVariant={ButtonVariations.DARK_MODE_TOGGLE}>
      DARK MODE BUTTON
    </Button>
  )
}
