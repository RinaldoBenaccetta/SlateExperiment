import React, { useState } from 'react'
import './App.css'

import SynonimEditor from './components/Editor/SynonimEditor'
import SlateEditor from './components/SlateTuto/SlateEditor'

const App = () => {


  return (
    <>
      <h1>Try this</h1>
      <h2>&, ctrl+k, ctrl+b</h2>
      <SlateEditor/>
      <h2>Synonym with right click (only in english) :</h2>
      <h3>select a word, then right click then select the synonym to replace with. You have to really select text : no double click.</h3>
      <SynonimEditor/>
    </>
  )

  // return (
  //   <>
  //     <SynonimEditor/>
  //   </>
  // )
}


export default App
