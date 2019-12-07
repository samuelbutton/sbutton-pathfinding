import React, {Component} from 'react';
import Node from '../Node/Node';
import Alert from '../Alert/Alert';
import Guide from '../Guide/Guide';
import {dijkstra} from '../../algorithms/dijkstra';
import {dfs} from '../../algorithms/dfs';
import {bfs} from '../../algorithms/bfs';
import {aStar} from '../../algorithms/aStar';
import {bidirectional} from '../../algorithms/bidirectionalBfs';
import {bestFirst} from '../../algorithms/bestFirst';

import './PathfindingVisualizer.css';

const NODE_WIDTH = 25;
const NODE_HEIGHT= 25;
const VISIT_DELAY = 5, SHORTEST_DELAY = 20;
let alertHandler;

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
      algorithm: undefined,
      showAlertBox: false,
      showGuideBox: true
    };
    alertHandler = props.alertHandler;
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
    const clearButtons = document.getElementsByClassName("clearButton");
    for (const button of clearButtons)
      button.style.color = '#fa923f';
    const select = document.getElementsByClassName("selector")[0];
    select.style.color = '#fa923f';
    select.disabled = true;
    const grid = document.getElementsByClassName('grid')[0];
    grid.style['min-height'] = "" + (NODE_HEIGHT * numberOfRows) + "px";
    grid.style['min-width'] = "" + (NODE_WIDTH * numberOfCols) + "px";
    const vizButton = document.getElementsByClassName('vizButton')[0];
    vizButton.style.color = '#521751';
  }

  unlockInteractions() {
    this.setState({visualizationRunning: false});
    const clearButtons = document.getElementsByClassName("clearButton");
    for (const button of clearButtons)
      button.style.color = 'white';
    const selectors = document.getElementsByClassName("selector");
    for (const selector of selectors) {   
      selector.style.color = 'white';
      selector.disabled = false;
    }
    const grid = document.getElementsByClassName('grid')[0];
    grid.style['min-height'] = "";
    grid.style['min-width'] = "";
    const vizButton = document.getElementsByClassName('vizButton')[0];
    vizButton.style.color = '#521751';
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

  setAlgorithm(algorithm) {
    switch (algorithm) {
      case 'dijkstra':
        this.setState({algorithm: dijkstra});
        break;
      case 'aStar':
        this.setState({algorithm: aStar});
        break;
      case 'bestFirst':
        this.setState({algorithm: bestFirst});
        break;
      case 'dfs':
        this.setState({algorithm: dfs});
        break;
      case 'bfs':
        this.setState({algorithm: bfs});
        break;
      case 'bidirectional':
        this.setState({algorithm: bidirectional});
        break;
      default:
        this.setState({showAlertBox: true});
        return;
    }
    this.clearVisualization(false);
    const initSelection = document.getElementsByClassName('initialSelection');
    initSelection[0].style.display = 'none';
    const vizButton = document.getElementsByClassName('vizButton');
    vizButton[0].style.background = 'yellow';
    vizButton[0].style.color = '#521751';
    const selection = document.getElementsByClassName('selector');
    selection[0].style.color = 'white';
  }

  async visualizeAlgorithm(animate) {
    if (this.state.visualizationRunning) return;
    if (this.state.algorithm === undefined) {
      alertHandler();
      this.setAlgorithm();
      return;
    }
    await this.clearVisualization(false, animate);
    await this.lockInteractions();
    const {grid, startNode, finishNode, algorithm} = this.state;
    
    const visitedNodesInOrder = await algorithm(grid, startNode, finishNode);
    const nodesInShortestPathOrder = await getShortestPathOrder(finishNode);

    if (!animate) {
      await this.adjustExistingVisistedNodes(grid, visitedNodesInOrder);
      await this.adjustExistingShortestNodes(grid, nodesInShortestPathOrder);
      this.unlockInteractions();
    } else {
      await this.animateArray(visitedNodesInOrder, VISIT_DELAY, 'node node-visited');
      setTimeout(() => {
         this.animateArray(nodesInShortestPathOrder, SHORTEST_DELAY, 'node node-shortest-path');
         setTimeout(() => {
           this.unlockInteractions();
         }, SHORTEST_DELAY * nodesInShortestPathOrder.length);
      }, VISIT_DELAY * visitedNodesInOrder.length);
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
        node.nextNode = null;
        node.isFinVisited = false;
        node.moves = 0;
      }
    }
    this.setState({grid});
    if (clearWalls) this.setState({visualizationDisplayed: false});
  }

  alertCloseHandler = () => {
    alertHandler();
    this.setState({showAlertBox: false});
  };
  guideCloseHandler = () => {
    this.setState({showGuideBox: false});
  };

  render() {
    const {grid, mouseIsPressed, showAlertBox, showGuideBox} = this.state;
    let alertBox, guideBox;
    if (showAlertBox) alertBox = <Alert click={this.alertCloseHandler}/>;
    if (showGuideBox) guideBox = <Guide click={this.guideCloseHandler}/>;
    if (grid !== null) return (
      <>
         {alertBox}
         {guideBox}
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
    nextNode: null,
    moves: 0,
    isFinVisited: false
  };
}

const getShortestPathOrder = (finishNode) => {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
