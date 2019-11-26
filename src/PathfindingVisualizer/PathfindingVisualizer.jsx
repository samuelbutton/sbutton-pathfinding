import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

const NUM_ROWS = 20;
const NUM_COLS = 50;
const START_NODE_ROW = 10;
const START_NODE_COL = 30;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }


  handleMouseDown(row, col, isStart, isFinish) {
  	let newGrid;
    if (!isStart && !isFinish) newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    // to be added: drag and drop for start and finish
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col, isStart, isFinish) {
    if (!this.state.mouseIsPressed) return;
    let newGrid
    if (!isStart && !isFinish) newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }


  // probably called when the button is pressed, but to be updated 
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

  // probable called after animateDijkstra is called, but to be updated 
  animateShortestPath(nodesInShortestPathOrder) {
  	// changes to 1 -> n-1 to leave first and last as is
    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
         document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 100 * i);
    }
  }

  async visualizeDijkstra() {
  	// pulls state of component
    const {grid} = this.state;
    for (let row = 0; row < NUM_ROWS; row++) {
	    for (let col = 0; col < NUM_COLS; col++) {
	      const node = grid[row][col];
	      
    	  node.distance = Infinity;
    	  node.previousNode = null;
	      if (node.isVisited && !node.isFinish && !node.isStart) 
	      	document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
	      node.isVisited = false;
	    }
  	}
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = await dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = await getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearVisualization() {
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
    const {grid, mouseIsPressed} = this.state;

    return (
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
          {grid.map((row, rowIdx) => {
          	// iterate across rows
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                	// iterated accross nodes in the row
                  const {row, col, isFinish, isStart, isWall} = node;
                  // if (rowIdx === 10 && nodeIdx === 34) console.log(isWall);
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
          })}
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