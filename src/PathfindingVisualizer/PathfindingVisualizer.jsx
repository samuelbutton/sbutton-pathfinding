import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

const NUM_ROWS = 20;
const NUM_COLS = 50;
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
      // NUM_ROWS = 20;
      // NUM_COLS = 50;
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
    console.log(this.state.visualizationRunning);
    if (this.state.visualizationRunning) return;
  	let newGrid;
    if (!isStart && !isFinish) newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    else if (isStart) {
      this.setState({mouseIsPressed: true, startDragging: true});
      return
    } else {
      this.setState({mouseIsPressed: true, finishDragging: true});
      return
    }
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col, isStart, isFinish) {
    if (!this.state.mouseIsPressed || this.state.visualizationRunning) return;
    let newGrid;
    if (this.state.startDragging) {
      newGrid = getNewGridWithStartAdjusted(this.state.grid, row, col, 
        this.state.startNodeRow, this.state.startNodeCol);
      this.setState({grid: newGrid, startNodeRow: row, startNodeCol: col});
      return;
    } else if (this.state.finishDragging) {
      newGrid = getNewGridWithFinishAdjusted(this.state.grid, row, col, 
        this.state.finishNodeRow, this.state.finishNodeCol);
      this.setState({grid: newGrid, finishNodeRow: row, finishNodeCol: col});
      return;
    } else if (!isStart && !isFinish) newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false, startDragging: false, finishDragging: false});
  }

  lockInteractions() {
    this.setState({visualizationRunning: true});
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

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
  	if (visitedNodesInOrder === null || nodesInShortestPathOrder === null) return;
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 5 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
         if (!node.isFinish && !node.isStart) 
         	document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, 5 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
  	// changes to 1 -> n-1 to leave first and last as is
    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
         document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 100 * i);
      if (i === nodesInShortestPathOrder.length - 2)   {
        setTimeout(() => {
          this.unlockInteractions();
        }, 100 * i);
      }
    }
  }

  async visualizeDijkstra() {
    if (this.state.visualizationRunning) return;
    await this.lockInteractions();
  	// TODO - while visualizing, cannot allow interaction with grid
    // should be able to re-run visualization twic without clearing the walls
    const {grid} = this.state;
    for (let row = 0; row < NUM_ROWS; row++) {
	    for (let col = 0; col < NUM_COLS; col++) {
	      const node = grid[row][col];
	      
    	  node.distance = Infinity;
    	  node.previousNode = null;
	      if (node.isVisited && !node.isFinish && !node.isStart && !node.isWall) 
	      	document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
	      node.isVisited = false;
	    }
  	}
    const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
    const finishNode = grid[this.state.finishNodeRow][this.state.finishNodeCol];
    const visitedNodesInOrder = await dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = await getNodesInShortestPathOrder(finishNode);
    await this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
     
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
  	this.setState({grid: grid});
  }

  render() {

  	// the actual rendering process, every time we render we pull the below two variables from 
  	// the state of the componenent
    const {grid, mouseIsPressed, visualizationRunning} = this.state;
    console.log(visualizationRunning);
    if (grid !== null) return (
    	// the below represents a React fragment, allows a component to return multiple elements 
      <>
        <button className="menu-button" onClick={() => this.visualizeDijkstra()}>
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
const getNewGridWithStartAdjusted = (grid, row, col, oldRow, oldCol) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: false,
    isStart: true,
  };
  newGrid[row][col] = newNode;
  const oldFinishNode = newGrid[oldRow][oldCol];
  const newFinishNode = {
    ...oldFinishNode,
    isStart: false,
  };
  newGrid[oldRow][oldCol] = newFinishNode;
  return newGrid;
};

const getNewGridWithFinishAdjusted = (grid, row, col, oldRow, oldCol) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: false,
    isFinish: true,
  };
  newGrid[row][col] = newNode;
  const oldFinishNode = newGrid[oldRow][oldCol];
  const newFinishNode = {
    ...oldFinishNode,
    isFinish: false,
  };
  newGrid[oldRow][oldCol] = newFinishNode;
  return newGrid;
};