import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import { ThemeProvider, LayoutText, ArticleFadeIn } from '@past3lle/schematics'

import './index.css'

const App = () => {
  return (
    <ArticleFadeIn>
      <LayoutText.largeHeader>EXAMPLE APP</LayoutText.largeHeader>
      <LayoutText.black>CODE HERE</LayoutText.black>
    </ArticleFadeIn>
  )
}

const container = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(container)
root.render(
  <>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </>
)
