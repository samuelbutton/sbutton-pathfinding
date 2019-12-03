import React, {Component} from 'react';
import Node from '../Node/Node';
import {dijkstra, getDijkstraShortestPathOrder} from '../../algorithms/dijkstra';
// import {depthFirst, getNodesInShortestPathOrder} from '../../algorithms/depthFirst';

import './PathfindingVisualizer.css';

const NODE_WIDTH = 25;
const NODE_HEIGHT= 25;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super();
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    const [numRows, numCols] = this.updateGridDimensions();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startDragging: false,
      finishDragging: false,
      visualizationRunning: false,
      visualizationDisplayed: false,
      numberOfRows: numRows,
      numberOfCols: numCols,
      startNode: undefined,
      finishNode: undefined,
      algorithm: 'dijkstra'
    };
  }

  updateGridDimensions() {
    let newDimensions = [];
    newDimensions.push(Math.floor((window.innerHeight-100)/NODE_HEIGHT));
    newDimensions.push(Math.floor((window.innerWidth-60)/NODE_WIDTH));
    return newDimensions;
  }

  getEndNodes(grid, numRows, numCols) {
    const endNodes = [];
    const startNode = grid[Math.floor(numRows*0.5)][Math.floor(numCols*0.1)];
    const finishNode = grid[Math.floor(numRows*0.5)][Math.floor(numCols*0.9)];
    startNode.isWall = false;
    finishNode.isWall = false;
    startNode.isStart = true;
    finishNode.isFinish = true;
    endNodes.push(startNode);
    endNodes.push(finishNode);
    return endNodes;
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    if (this.state.visualizationRunning) return;
    const {grid, visualizationDisplayed} = this.state;
    let numberOfRows = Math.floor((window.innerHeight-100)/NODE_HEIGHT);
    let numberOfCols = Math.floor((window.innerWidth-60)/NODE_WIDTH);
    const newGrid = getNewGrid(grid, numberOfRows, numberOfCols);
    const [startNode, finishNode] = this.getEndNodes(newGrid, numberOfRows, numberOfCols);

    this.setState({ 
      grid: newGrid,
      numberOfRows,
      numberOfCols,
      startNode,
      finishNode
    });

    if (visualizationDisplayed) this.visualizeAlgorithm(false);
  }

  handleMouseDown(row, col) {
    if (this.state.visualizationRunning) return;
    const {grid, visualizationDisplayed} = this.state;
    if (!grid[row][col].isStart && !grid[row][col].isFinish) {
      grid[row][col].isWall = !grid[row][col].isWall;
      this.setState({grid, mouseIsPressed: true});
      if (visualizationDisplayed) this.visualizeAlgorithm(false);
    }
    else if (grid[row][col].isStart) {
      this.setState({mouseIsPressed: true, startDragging: true});
    } else {
      this.setState({mouseIsPressed: true, finishDragging: true});
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed || this.state.visualizationRunning) return;
    const {grid, startDragging, finishDragging, startNode, finishNode, visualizationDisplayed} = this.state;
    if (grid[row][col].isStart || grid[row][col].isFinish) return;
    if (startDragging) {
        const newStartNode = this.adjustEnd(grid, row, col, startNode, true);
        this.setState({grid, startNode: newStartNode});
    } else if (finishDragging) {
        const newFinishNode = this.adjustEnd(grid, row, col, finishNode, false);
        this.setState({grid, finishNode: newFinishNode});
    } else {
      grid[row][col].isWall = !grid[row][col].isWall;
      this.setState({grid});
    }
    if (visualizationDisplayed) this.visualizeAlgorithm(false);
  }

  adjustEnd(grid, row, col, endNode, isStart) {
    const node = grid[row][col];
    node.isWall = false;
    if (isStart) node.isStart = true;
    else node.isFinish = true;
    endNode.isStart = false;
    endNode.isFinish = false;
    return node;
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false, startDragging: false, finishDragging: false});
  }

  lockInteractions() {
    this.setState({visualizationRunning: true, visualizationDisplayed: true});
    const {numberOfRows, numberOfCols} = this.state;
    const buttons = document.getElementsByTagName("button");
    for (const button of buttons)
      button.style.color = 'yellow';
    const grids = document.getElementsByClassName('grid');
    for (const grid of grids) {
      grid.style['min-height'] = "" + (NODE_HEIGHT * numberOfRows) + "px";
      grid.style['min-width'] = "" + (NODE_WIDTH * numberOfCols) + "px";
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
    const {numberOfRows, numberOfCols} = this.state;
    let tempVisited = new Array(numberOfRows).fill(false).map(() => new Array(numberOfCols).fill(false));
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

  async visualizeAlgorithm(animate) {
    if (this.state.visualizationRunning || this.state.algorithm === undefined) return;
    await this.clearVisualization(false, animate);
    await this.lockInteractions();
    const {grid, startNode, finishNode, algorithm} = this.state;
    const visitedDelay = 5, shortestDelay = 20;
    const getAllNodes = await this.getAllNodesAlgo(algorithm);
    const getShortestPathNodes = await this.getShortNodesAlgo(algorithm);
    const visitedNodesInOrder = await getAllNodes(grid, startNode, finishNode);
    const nodesInShortestPathOrder = await getShortestPathNodes(finishNode);

    if (!animate) {
      await this.adjustExistingVisistedNodes(grid, visitedNodesInOrder);
      await this.adjustExistingShortestNodes(grid, nodesInShortestPathOrder);
      this.unlockInteractions();
    } else {
      await this.animateArray(visitedNodesInOrder, visitedDelay, 'node node-visited');
      setTimeout(() => {
         this.animateArray(nodesInShortestPathOrder, shortestDelay, 'node node-shortest-path');
         setTimeout(() => {
           this.unlockInteractions();
         }, shortestDelay * nodesInShortestPathOrder.length);
      }, visitedDelay * visitedNodesInOrder.length);
    } 
  }

  getAllNodesAlgo(algorithm) {
    return dijkstra;
  }

  getShortNodesAlgo(algorithm) {
    return getDijkstraShortestPathOrder;
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
    if (clearWalls) this.setState({grid, visualizationDisplayed: false});
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

const getNewGrid = (grid, rows, cols) => {
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
  return {
    col,
    row,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
