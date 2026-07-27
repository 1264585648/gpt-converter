import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import './home-calibration.css'
import './converter-calibration.css'
import './formats-calibration.css'
import './compare-calibration.css'
import './qa-fixes.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
