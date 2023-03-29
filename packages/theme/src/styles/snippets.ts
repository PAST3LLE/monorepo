import { BASE_FONT_SIZE_PX, LAYOUT_REM_SIZE_MAP } from '@past3lle/constants'
import { css } from 'styled-components'

/***
    The new CSS reset - version 1.8.2 (last updated 23.12.2022)
    GitHub page: https://github.com/elad2412/the-new-css-reset 
***/
export const CssResetSnippet = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  a,
  button {
    cursor: revert;
  }

  ol,
  ul,
  menu {
    list-style: none;
  }

  img {
    max-inline-size: 100%;
    max-block-size: 100%;
  }

  table {
    border-collapse: collapse;
  }

  input,
  textarea {
    -webkit-user-select: auto;
  }

  textarea {
    white-space: revert;
  }

  meter {
    -webkit-appearance: revert;
    appearance: revert;
  }

  pre {
    all: revert;
  }

  ::placeholder {
    color: unset;
  }

  ::marker {
    content: '';
  }

  :where([hidden]) {
    display: none;
  }

  :where([contenteditable]:not([contenteditable='false'])) {
    -moz-user-modify: read-write;
    -webkit-user-modify: read-write;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
    -webkit-user-select: auto;
  }

  :where([draggable='true']) {
    -webkit-user-drag: element;
  }

  :where(dialog:modal) {
    all: revert;
  }
`

export const CommonGlobalCssSnippet = css`
  * {
    &::-webkit-scrollbar {
      width: 0px;
      border-radius: 16px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: ghostwhite;
      border-radius: 16px;
      background-clip: padding-box;
    }
  }

  html,
  input,
  textarea,
  button {
    border: none;
  }

  html,
  body {
    font-family: sans-serif;
    font-size: ${BASE_FONT_SIZE_PX}px;
    margin: 0;
    padding: 0;
  }

  @supports (font-variation-settings: normal) {
    html,
    body {
      font-family: 'Roboto Flex';
    }
  }

  html {
    font-variant: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
  }

  body {
    background-repeat: no-repeat;
  }

  header {
    height: ${LAYOUT_REM_SIZE_MAP.HEADER}rem;
    grid-area: header;
  }

  footer {
    height: ${LAYOUT_REM_SIZE_MAP.FOOTER}rem;
    grid-area: footer;
  }

  nav {
    grid-area: nav;
    width: ${LAYOUT_REM_SIZE_MAP.NAV}rem;
  }

  article {
    grid-area: main;
  }

  nav,
  article {
    overflow-y: auto;
  }

  button {
    user-select: none;
  }

  body > div#root {
    height: calc(${LAYOUT_REM_SIZE_MAP.FOOTER + LAYOUT_REM_SIZE_MAP.HEADER}rem + 100vh);
    display: grid;
    grid-template-areas:
      'header header'
      'nav main'
      'footer footer';
    grid-template-columns: minmax(auto, max-content) 5fr;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
  }

  select {
    appearance: none;
    background-color: transparent;
    border: none;
    padding: 0 1em 0 0;
    margin: 0;
    width: 100%;
    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit;
  }
`
