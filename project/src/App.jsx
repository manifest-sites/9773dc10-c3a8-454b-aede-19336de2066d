import { useState, useEffect } from 'react'
import Monetization from './components/monetization/Monetization'
import PenguinApp from './components/PenguinApp'

function App() {

  return (
    <Monetization>
      <PenguinApp />
    </Monetization>
  )
}

export default App