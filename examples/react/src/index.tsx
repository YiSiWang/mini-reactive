import * as React from 'react'
import * as ReactDom from 'react-dom'
import App from './App'

ReactDom.render(
  <App/>,
  document.body.insertAdjacentElement(
    'beforeend',
    document.createElement('div')
  ),
)
