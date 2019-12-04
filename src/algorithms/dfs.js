
export async function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  search(startNode, grid, visitedNodesInOrder, false);
  return visitedNodesInOrder;
}

function search(node, grid, visitedNodesInOrder, found) {
  visitedNodesInOrder.push(node);
  node.isVisited = true;
  if (node.isFinish || found) return true;
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  if (unvisitedNeighbors.length === 0) return false;
  shuffle(unvisitedNeighbors);
  for (const neighbor of unvisitedNeighbors) {
    found = search(neighbor, grid, visitedNodesInOrder, found);
    if (found) {
      neighbor.previousNode = node;
      break;
    }
  }
  return found;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

function shuffle(array) {
  for (let i = 0; i< array.length; i++) {
    const randInd = randomIntFromInterval(0, i);
    exch(array, i, randInd);
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function exch(array, ind1, ind2) {
  const temp = array[ind1];
  array[ind1] = array[ind2];
  array[ind2] = temp;
}