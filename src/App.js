import React from 'react';
import './App.css';
// import Draggable from './Draggable';
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

// import React from 'react';


// const App = () => {
//   return (
//     <div>
//       <Draggable onDrag={console.log} id="uniqueId">
//         <h2>Drag me</h2>
//       </Draggable>
//     </div>
//   );
// };

// export default App;