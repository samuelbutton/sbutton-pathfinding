
export async function bidirectional(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  let startCandidates = [];
  startCandidates.push(startNode);
  let finishCandidates = [];
  finishNode.distance = 0;
  finishCandidates.push(finishNode);
  search(grid, visitedNodesInOrder, startCandidates, finishCandidates);
  return visitedNodesInOrder;
}

function search(grid, visitedNodesInOrder, startCandidates, finishCandidates) {
  while (startCandidates.length !== 0 || finishCandidates.length !== 0) {
    if (startCandidates.length !== 0) {
      let node = startCandidates.shift();
      visitedNodesInOrder.push(node);
      node.isVisited = true;
      if (node.isFinVisited) {
        while(node !== null) {
          if (node.nextNode !== null) node.nextNode.previousNode = node;
          node = node.nextNode;
        }
        break;
      }
      const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
      for (const neighbor of unvisitedNeighbors) {
        neighbor.isVisited = true;
        neighbor.previousNode = node;
        startCandidates.push(neighbor);
      }
    }
    if (finishCandidates.length !== 0) {
      let node2 = finishCandidates.shift();
      visitedNodesInOrder.push(node2);
      node2.isFinVisited = true;
      if (node2.isVisited) {
        while(node2 !== null) {
          if (node2.nextNode !== null) node2.nextNode.previousNode = node2;
          node2 = node2.nextNode;
        }
        break;
      }
      const unvisitedNeighbors2 = getUnFinVisitedNeighbors(node2, grid);
      for (const neighbor of unvisitedNeighbors2) {
        neighbor.isFinVisited = true;
        neighbor.nextNode = node2;
        finishCandidates.push(neighbor);
      }
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  let tempNode;
  if (row > 0) {
    tempNode = grid[row - 1][col];
    if (!tempNode.isVisited && !tempNode.isWall)
      neighbors.push(tempNode);
  }
  if (row < grid.length - 1) {
    tempNode = grid[row + 1][col];
    if (!tempNode.isVisited && !tempNode.isWall)
      neighbors.push(tempNode);
  }
  if (col > 0) {
    tempNode = grid[row][col - 1];
    if (!tempNode.isVisited && !tempNode.isWall)
      neighbors.push(tempNode);
  }
  if (col < grid[0].length - 1) {
    tempNode = grid[row][col + 1];
    if (!tempNode.isVisited && !tempNode.isWall)
      neighbors.push(tempNode);
  }
  return neighbors;
}

function getUnFinVisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  let tempNode;
  if (row > 0) {
    tempNode = grid[row - 1][col];
    if (!tempNode.isFinVisited && !tempNode.isWall)
      neighbors.push(tempNode);
  }
  if (row < grid.length - 1) {
    tempNode = grid[row + 1][col];
    if (!tempNode.isFinVisited && !tempNode.isWall)
      neighbors.push(tempNode);
  }
  if (col > 0) {
    tempNode = grid[row][col - 1];
    if (!tempNode.isFinVisited && !tempNode.isWall)
      neighbors.push(tempNode);
  }
  if (col < grid[0].length - 1) {
    tempNode = grid[row][col + 1];
    if (!tempNode.isFinVisited && !tempNode.isWall)
      neighbors.push(tempNode);
  }
  return neighbors;
}