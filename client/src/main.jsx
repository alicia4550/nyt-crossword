import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { getUrl, getDataString, getCrosswordData } from '../..api/crosswordData'

const url = getUrl()
const dataString = await getDataString(url)
const crosswordData = getCrosswordData(dataString)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App crosswordData={crosswordData} />
  </React.StrictMode>,
)
