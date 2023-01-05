import React from 'react';
import './App.css';
import Canvas from './components/Canvas/Canvas';
import Options from './components/Options/Options';


function App() {
  return (
    <div style={{position: 'relative'}}>
      <Canvas />
      <Options />
    </div>
  );
}

export default App;
