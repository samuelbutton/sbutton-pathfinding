import React from 'react';
import './App.css';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer'

function App() {
  return (
    // only work out of PathfindingVisualizer component
    <div className="App">
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
}

export default App;
