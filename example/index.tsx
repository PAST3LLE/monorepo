import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './index.css'

const App = () => {
  return (
    <div>
      <h1>EXAMPLE APP</h1>
      <p>CODE HERE</p>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
