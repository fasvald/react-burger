/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './components/app/app'
import reportWebVitals from './reportWebVitals'
import 'normalize.css'
import './index.css'
import store from './store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('app-root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

// expose store when run in Cypress
if ((window as any).Cypress) {
  ;(window as any).store = store
}
