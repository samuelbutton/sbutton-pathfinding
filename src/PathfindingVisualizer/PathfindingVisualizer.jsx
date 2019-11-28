import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

// add responsiveness of grid size to scale up and down with that of window
const NUM_ROWS = 20;
const NUM_COLS = 50;
// can be removed if necessary
const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startDragging: false,
      finishDragging: false,
      visualizationRunning: false,
      visualizationDisplayed: false,
      // numberOfRows: 20,
      // numberOfCols: 50,
      startNodeRow: 10,
      startNodeCol: 5,
      finishNodeRow: 10,
      finishNodeCol: 45
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }


  handleMouseDown(row, col, isStart, isFinish) {
    if (this.state.visualizationRunning) return;
  	let newGrid;
    if (!isStart && !isFinish) {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
      if (this.state.visualizationDisplayed) this.visualizeDijkstra(false);
    }
    else if (isStart) {
      this.setState({mouseIsPressed: true, startDragging: true});
    } else {
      this.setState({mouseIsPressed: true, finishDragging: true});
    }
  }

  handleMouseEnter(row, col, isStart, isFinish) {
    if (!this.state.mouseIsPressed || this.state.visualizationRunning) return;

    let newGrid;

    if (this.state.startDragging || this.state.finishDragging) {
      if (this.state.startDragging) {
        newGrid = getNewGridWithEndAdjusted(this.state.grid, row, col, this.state.startNodeRow, 
          this.state.startNodeCol, true);
        this.setState({grid: newGrid, startNodeRow: row, startNodeCol: col});
      } else {
        newGrid = getNewGridWithEndAdjusted(this.state.grid, row, col, this.state.finishNodeRow, 
          this.state.finishNodeCol, false);
        this.setState({grid: newGrid, finishNodeRow: row, finishNodeCol: col});
      }
    } else if (!isStart && !isFinish) {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col, this.state.visualizationDisplayed);
      this.setState({grid: newGrid});
    }
    if (this.state.visualizationDisplayed) this.visualizeDijkstra(false);
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false, startDragging: false, finishDragging: false});
  }

  lockInteractions() {
    this.setState({visualizationRunning: true, visualizationDisplayed: true});
    let buttons = document.getElementsByClassName("menu-button")
    let i = 0;
    for (i; i < buttons.length; i++)
      buttons[i].style.visibility = 'hidden';
  }

  unlockInteractions() {
    this.setState({visualizationRunning: false});
    let buttons = document.getElementsByClassName("menu-button")
    let i = 0;
    for (i; i < buttons.length; i++)
      buttons[i].style.visibility = 'visible';
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, animate, tempVisited) {
    const delay = animate ? 5 : 0;
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder, animate);
        }, delay * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
         if (!node.isFinish && !node.isStart) {
         	if (!animate && !tempVisited[node.row][node.col]) 
             document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
           else if (animate) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
         }
      }, delay * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder, animate) {
  	// changes to 1 -> n-1 to leave first and last as is
    const delay = animate ? 100 : 0;
    if (nodesInShortestPathOrder.length === 1) {
      this.unlockInteractions();
      return;
    }
    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
         document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, delay * i);
      if (i === nodesInShortestPathOrder.length - 2)   {
        setTimeout(() => {
          this.unlockInteractions();
        }, delay * i);
      }
    }
  }

  async visualizeDijkstra(animate) {
    if (this.state.visualizationRunning) return;
    await this.lockInteractions();
    const {grid} = this.state;
    // let newGrid = grid.slice();
    for (let row = 0; row < NUM_ROWS; row++) {
	    for (let col = 0; col < NUM_COLS; col++) {
	      const node = grid[row][col];
	      
    	  node.distance = Infinity;
    	  node.previousNode = null;
	      if (node.isVisited && !node.isFinish && !node.isStart && !node.isWall) 
	      	if (animate) document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
        node.isVisited = false;
	    }
  	}
    const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
    const finishNode = grid[this.state.finishNodeRow][this.state.finishNodeCol];
    const visitedNodesInOrder = await dijkstra(grid, startNode, finishNode);
    if (!animate) {
      let tempVisited = new Array(NUM_ROWS).fill(false).map(() => new Array(NUM_COLS).fill(false));
      for (const node of visitedNodesInOrder) {
        tempVisited[node.row][node.col] = true;
      }
      for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
          const node = grid[row][col];
          if (!tempVisited[row][col] && !node.isFinish && !node.isStart && !node.isWall) 
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
        }
      }
    }
    const nodesInShortestPathOrder = await getNodesInShortestPathOrder(finishNode);
    let tempVisited = new Array(NUM_ROWS).fill(false).map(() => new Array(NUM_COLS).fill(false));
    if (!animate) {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        const node = nodesInShortestPathOrder[i];
        tempVisited[node.row][node.col] = true;
      }
    }
    await this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, animate, tempVisited);
  }

  clearVisualization() {
    if (this.state.visualizationRunning) return;
  	const {grid} = this.state;
  	for (let row = 0; row < NUM_ROWS; row++) {
	    for (let col = 0; col < NUM_COLS; col++) {
	      const node = grid[row][col];
	      node.isWall = false;
	      node.isVisited = false;
    	  node.distance = Infinity;
    	  node.previousNode = null;
	      if (!node.isFinish && !node.isStart) 
	      	document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
	    }
  	}
  	this.setState({grid: grid, visualizationDisplayed: false});
  }

  render() {

  	// the actual rendering process, every time we render we pull the below two variables from 
  	// the state of the componenent
    const {grid, mouseIsPressed} = this.state;
    if (grid !== null) return (
    	// the below represents a React fragment, allows a component to return multiple elements 
      <>
        <button className="menu-button" onClick={() => this.visualizeDijkstra(true)}>
          Visualize Dijkstra's Algorithm
        </button>
        <button className="menu-button" onClick={() => this.clearVisualization()}>
          Clear Walls
        </button>
        <button className="menu-button" onClick={() => this.clearVisualization()}>
          Clear Visualization
        </button>
        <div className="grid">
            {
              grid.map((row, rowIdx) => {
              	// iterate across rows
                return (
                  <div key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                    	// iterated accross nodes in the row
                      const {row, col, isFinish, isStart, isWall} = node;
                  
                        return (
                        <Node
                          key={nodeIdx}
                          col={col}
                          isFinish={isFinish}
                          isStart={isStart}
                          isWall={isWall}
                          mouseIsPressed={mouseIsPressed}
                          onMouseDown={(row, col, isStart, isFinish) => this.handleMouseDown(row, col, isStart, isFinish)}
                          onMouseEnter={(row, col, isStart, isFinish) =>
                            this.handleMouseEnter(row, col, isStart, isFinish)
                          }
                          onMouseUp={() => this.handleMouseUp()}
                          row={row}></Node>
                        );
                    })}
                  </div>
                );
              })
            }
        </div>
      </>
    );
  }
}

// constructs initial grid for the constructor
const getInitialGrid = () => {
  const grid2 = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NUM_COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid2.push(currentRow);
  }
  return grid2;
};

// construct an individual node for adding to the grid
const createNode = (col, row) => {
	// TODO: replace with access of constructor? For Node component?
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];

  const newNode = {
    ...node,
    isWall: !node.isWall,
  };

  newGrid[row][col] = newNode;
  return newGrid;
};

// TODO - refactor below two methods to combine
const getNewGridWithEndAdjusted = (grid, row, col, oldRow, oldCol, startOrFinish) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  let newNode;
  if (startOrFinish) {
    newNode = {
      ...node,
      isWall: false,
      isStart: true,
    };
  } else {
    newNode = {
      ...node,
      isWall: false,
      isFinish: true,
    };
  }
  newGrid[row][col] = newNode;
  const oldEndNode = newGrid[oldRow][oldCol];
  const newEndNode = {
    ...oldEndNode,
    isStart: false,
    isFinish: false,
  };
  newGrid[oldRow][oldCol] = newEndNode;
  return newGrid;
};