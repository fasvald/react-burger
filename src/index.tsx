import React from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/app/app'
import reportWebVitals from './reportWebVitals'
import 'normalize.css'
import './index.css'
import store from './store'

/* NOTE: There will be FOUC, but still there are a lot of approaches how to deal with it */

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('app-root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
