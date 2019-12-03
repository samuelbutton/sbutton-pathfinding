import React, {Component} from 'react';
import Node from '../Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../../algorithms/dijkstra';
// import {depthFirst, getNodesInShortestPathOrder} from '../../algorithms/depthFirst';

import './PathfindingVisualizer.css';

const NODE_WIDTH = 25;
const NODE_HEIGHT= 25;
let START_NODE_COL, START_NODE_ROW, FINISH_NODE_ROW, FINISH_NODE_COL;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super();
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    const [numRows, numCols] = this.updateGridDimensions();
    this.updateEndCoordinates(numRows, numCols);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startDragging: false,
      finishDragging: false,
      visualizationRunning: false,
      visualizationDisplayed: false,
      numberOfRows: numRows,
      numberOfCols: numCols,
      startNodeRow: START_NODE_ROW,
      startNodeCol: START_NODE_COL, 
      finishNodeRow: FINISH_NODE_ROW,
      finishNodeCol: FINISH_NODE_COL
    };
  }

  updateGridDimensions() {
    let newDimensions = [];
    newDimensions.push(Math.floor((window.innerHeight-100)/NODE_HEIGHT));
    newDimensions.push(Math.floor((window.innerWidth-60)/NODE_WIDTH));
    return newDimensions;
  }

  updateEndCoordinates(numRows, numCols) {
    START_NODE_COL = Math.floor(numCols*0.1);
    START_NODE_ROW = Math.floor(numRows*0.5);
    FINISH_NODE_COL = Math.floor(numCols*0.90);
    FINISH_NODE_ROW = Math.floor(numRows*0.5);
  }

  componentDidMount() {
    let initGrid = [];
    const grid = getInitialGrid(initGrid, this.state.numberOfRows, this.state.numberOfCols);
    this.setState({grid});
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    if (this.state.visualizationRunning) return;
    let numRows = Math.floor((window.innerHeight-100)/NODE_HEIGHT);
    let numCols = Math.floor((window.innerWidth-60)/NODE_WIDTH);
    this.updateEndCoordinates(numRows, numCols);
    this.setState({ 
      numberOfRows: numRows, 
      numberOfCols: numCols,
      startNodeRow: START_NODE_ROW,
      startNodeCol: START_NODE_COL, 
      finishNodeRow: FINISH_NODE_ROW,
      finishNodeCol: FINISH_NODE_COL
    });
    const grid = getInitialGrid(this.state.grid, this.state.numberOfRows, this.state.numberOfCols);
    grid[START_NODE_ROW][START_NODE_COL].isWall = false;
    grid[FINISH_NODE_ROW][FINISH_NODE_COL].isWall = false;
    this.setState({grid: grid});
    if (this.state.visualizationDisplayed) this.visualizeDijkstra(false);
  }

  handleMouseDown(row, col) {
    if (this.state.visualizationRunning) return;
    const {grid} = this.state;
    let newGrid;
    if (!grid[row][col].isStart && !grid[row][col].isFinish) {
      newGrid = getNewGridWithWallToggled(grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
      if (this.state.visualizationDisplayed) this.visualizeDijkstra(false);
    }
    else if (grid[row][col].isStart) {
      this.setState({mouseIsPressed: true, startDragging: true});
    } else {
      this.setState({mouseIsPressed: true, finishDragging: true});
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed || this.state.visualizationRunning) return;
    const {grid} = this.state;
    if (grid[row][col].isStart || grid[row][col].isFinish) return;
    let newGrid;
    if (this.state.startDragging) {
        newGrid = getNewGridWithEndAdjusted(grid, row, col, this.state.startNodeRow, 
          this.state.startNodeCol, true);
        this.setState({grid: newGrid, startNodeRow: row, startNodeCol: col});
    } else if (this.state.finishDragging) {
        newGrid = getNewGridWithEndAdjusted(grid, row, col, this.state.finishNodeRow, 
          this.state.finishNodeCol, false);
        this.setState({grid: newGrid, finishNodeRow: row, finishNodeCol: col});
    } else {
      newGrid = getNewGridWithWallToggled(grid, row, col, this.state.visualizationDisplayed);
      this.setState({grid: newGrid});
    }
    if (this.state.visualizationDisplayed) this.visualizeDijkstra(false);
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false, startDragging: false, finishDragging: false});
  }

  lockInteractions() {
    this.setState({visualizationRunning: true, visualizationDisplayed: true});
    const buttons = document.getElementsByTagName("button");
    for (const button of buttons)
      button.style.color = 'yellow';
    const grids = document.getElementsByClassName('grid');
    for (const grid of grids) {
      grid.style['min-height'] = "" + (NODE_HEIGHT * this.state.numberOfRows) + "px";
      grid.style['min-width'] = "" + (NODE_WIDTH * this.state.numberOfCols) + "px";
    }
  }

  unlockInteractions() {
    this.setState({visualizationRunning: false});
    const buttons = document.getElementsByTagName("button");
    for (const button of buttons)
      button.style.color = 'white';
    const grids = document.getElementsByClassName('grid');
    for (const grid of grids) {
      grid.style['min-height'] = "";
      grid.style['min-width'] = "";
    }
  }

  animateArray(array, delay, classname) {
    let i = 0;
    for (const node of array) {
      setTimeout(() => {
         if (!node.isFinish && !node.isStart)
           document.getElementById(`node-${node.row}-${node.col}`).className = classname;
      }, delay * i++);
    }
  }

  adjustExistingVisistedNodes(grid, visitedNodesInOrder) {
    if (visitedNodesInOrder === undefined) return;
    let tempVisited = new Array(this.state.numberOfRows).fill(false).map(() => new Array(this.state.numberOfCols).fill(false));
    for (const node of visitedNodesInOrder) {
      tempVisited[node.row][node.col] = true;
      if (!node.isFinish && !node.isStart) 
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
    }
    for (const row of grid) {
      for (const node of row) {
        if (!tempVisited[node.row][node.col] && !node.isFinish && !node.isStart && !node.isWall) 
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
      }
    }
  }

  adjustExistingShortestNodes(grid, nodesInShortestPathOrder) {
    if (nodesInShortestPathOrder === undefined) return;
    for (const node of nodesInShortestPathOrder) {
        if (!node.isFinish && !node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
        }
    }
  }

  async visualizeAlgo(animate, getAllNodes, getShortestPathNodes) {
    if (this.state.visualizationRunning) return;
    await this.clearVisualization(false, animate);
    await this.lockInteractions();
    const {grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol} = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = await getAllNodes(grid, startNode, finishNode);
    const nodesInShortestPathOrder = await getShortestPathNodes(finishNode);

    if (!animate) {
      await this.adjustExistingVisistedNodes(grid, visitedNodesInOrder);
      await this.adjustExistingShortestNodes(grid, nodesInShortestPathOrder);
      this.unlockInteractions();
    } else {
      const visitedDelay = 5, shortestDelay = 20;
      await this.animateArray(visitedNodesInOrder, visitedDelay, 'node node-visited');
      setTimeout(() => {
         this.animateArray(nodesInShortestPathOrder, shortestDelay, 'node node-shortest-path');
         setTimeout(() => {
           this.unlockInteractions();
         }, shortestDelay * nodesInShortestPathOrder.length);
      }, visitedDelay * visitedNodesInOrder.length);
    } 
  }

  async visualizeDijkstra(animate) {
    if (this.state.visualizationRunning) return;
    await this.clearVisualization(false, animate);
    await this.lockInteractions();
    const {grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol} = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = await dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = await getNodesInShortestPathOrder(finishNode);

    if (!animate) {
      await this.adjustExistingVisistedNodes(grid, visitedNodesInOrder);
      await this.adjustExistingShortestNodes(grid, nodesInShortestPathOrder);
      this.unlockInteractions();
    } else {
      const visitedDelay = 5, shortestDelay = 80;
      await this.animateArray(visitedNodesInOrder, visitedDelay, 'node node-visited');
      setTimeout(() => {
         this.animateArray(nodesInShortestPathOrder, shortestDelay, 'node node-shortest-path');
         setTimeout(() => {
           this.unlockInteractions();
         }, shortestDelay * nodesInShortestPathOrder.length);
      }, visitedDelay * visitedNodesInOrder.length);
    } 
  }

  clearVisualization(clearWalls, animate) {
    if (this.state.visualizationRunning) return;
    const {grid} = this.state;
    for (const row of grid) {
      for (const node of row) {
        node.isVisited = false;
        if (clearWalls) {
          node.isWall = false;
          if (!node.isFinish && !node.isStart) 
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
        } else {
            if (!node.isFinish && !node.isStart && !node.isWall && animate) {
              document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
            }
        }
        node.distance = Infinity;
        node.previousNode = null;
      }
    }
    if (clearWalls) this.setState({grid: grid, visualizationDisplayed: false});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;
    if (grid !== null) return (
      <>
        <div className="grid">
            {grid.map((row, rowIdx) => {
                return (
                  <div key={rowIdx}>
                    {row.map((node, nodeIdx) => {
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
                          onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                          onMouseUp={() => this.handleMouseUp()}
                          row={row} />
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

const getInitialGrid = (grid, rows, cols) => {
  // refactor to use given grid
  let oldCols;
  let newGrid = [];
  const oldRows = grid.length;
  if (oldRows > 0) oldCols = grid[0].length;
  else oldCols = 0;
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      let node = createNode(col, row);
      if (row < oldRows && col < oldCols && grid[row][col].isWall)
        node.isWall = true;
      currentRow.push(node);
    }
    newGrid.push(currentRow);
  }
  return newGrid;
}

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

const getNewGridWithEndAdjusted = (grid, row, col, oldRow, oldCol, startOrFinish) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  let newNode = {
      ...node,
      isWall: false,
    };
  if (startOrFinish) newNode.isStart = true;
  else newNode.isFinish = true;
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