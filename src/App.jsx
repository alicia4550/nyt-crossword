import { useState } from 'react'
import './App.css'

import crosswordData from './crosswordData'
import Crossword from './components/Crossword'

function App() {
  return (
    <>
        <Crossword data={crosswordData} />
    </>
  )
}

export default App
