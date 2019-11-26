import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

const NUM_ROWS = 20;
const NUM_COLS = 50;
const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    // defines what attributes the state is characterized by,
    // in addition to the initial state of the component
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  // called when component is actually mounted to the DOM, so only once
  // if looking for a method that is claled everytime the component is rendered, use 
  // componentWillUpdate, or componentDidUpdate
  componentDidMount() {
  	// get new grid
    const grid = getInitialGrid();
    // sets new state using the grid the component was constructed with
    this.setState({grid});
  }


  // when mouse is pressed, irrespective of whether it is released
  // called on component, as part of the Node, because mouse down effects Node display
  handleMouseDown(row, col) {
  	// getNewGridWithWallToggled
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    // resets state of the component, which causes the UI elements to be re-rendered
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
  	// we do not care if the mouse enters a node and mouse is not pressed
    if (!this.state.mouseIsPressed) return;
    // if mouse is pressed, then we toggle the node that has been entered
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    // re-set the state of the grid, but do not change mouseIsPressed
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
  	// just re-set state (again causing a re-rendering of the UI)
    this.setState({mouseIsPressed: false});
  }


  // probably called when the button is pressed, but to be updated 
  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  // probable called after animateDijkstra is called, but to be updated 
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 100 * i);
    }
  }

  visualizeDijkstra() {
  	// pulles state of component
    const {grid} = this.state;
    // pull start and finish node
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    // actual algo
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {

  	// the actual rendering process, every time we render we pull the below two variables from 
  	// the state of the componenent
    const {grid, mouseIsPressed} = this.state;

    return (
    	// the below represents a React fragment, allows a component to return multiple elements 
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
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
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
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
  const grid = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NUM_COLS; col++) {
    	// adds nodes iterating over values
      currentRow.push(createNode(col, row));
    }
    // adds row of nodes to the grid
    grid.push(currentRow);
  }
  return grid;
};

// construct an individual node for adding to the grid
const createNode = (col, row) => {
	// just initializes this structure and highlights start, finish, distance and visited
	// does not specify Node structure but defines all attributes of the node

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
	// copies grid
  const newGrid = grid.slice();
  // pulls structure with all attributes of Node
  const node = newGrid[row][col];

  const newNode = {
  	// property spread notation to use existing properties
    ...node,
    // but then negate the isWall attribute, which overrides the previous isWall attribute
    isWall: !node.isWall,
  };

  // pop it in to the new grid
  newGrid[row][col] = newNode;
  return newGrid;
};