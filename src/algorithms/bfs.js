
export async function bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  let candidates = [];
  candidates.push(startNode);
  search(grid, visitedNodesInOrder, candidates);
  return visitedNodesInOrder;
}

function search(grid, visitedNodesInOrder, candidates) {
  while (candidates.length !== 0) {
    const node = candidates.shift();
    visitedNodesInOrder.push(node);
    node.isVisited = true;
    if (node.isFinish) break;
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    // shuffle(unvisitedNeighbors);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = node;
      candidates.push(neighbor);
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
