import React from 'react';
import './App.css';
// import Draggable from './Draggable';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer'
import SortingVisualizer from './SortingVisualizer/SortingVisualizer'

function App() {
  return (
    // only work out of PathfindingVisualizer component
    
    	// <PathfindingVisualizer></PathfindingVisualizer>
    <div className="App">
      
      <SortingVisualizer></SortingVisualizer>
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