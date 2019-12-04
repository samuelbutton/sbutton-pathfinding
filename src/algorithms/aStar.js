

export async function aStar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  
  const candidates = [];
  candidates.push(startNode);
  search(grid, visitedNodesInOrder, candidates, finishNode);
  return visitedNodesInOrder;
}


function search(grid, visitedNodesInOrder, candidates, finishNode) {
  let movesMade = 1;
  while (candidates.length !== 0) {
    const node = candidates.shift();
    visitedNodesInOrder.push(node);
    node.isVisited = true;
    if (node.isFinish) break;
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

    for (const neighbor of unvisitedNeighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = node;
      candidates.push(neighbor);
    }
    sortNodesByManhattanDistance(candidates, finishNode, movesMade++);
  }
}

function sortNodesByManhattanDistance(unvisitedNodes, finishNode, movesMade) {
  unvisitedNodes.sort((nodeA, nodeB) => (movesMade + Math.abs(nodeA.row - finishNode.row) + Math.abs(nodeA.col - finishNode.col)) - (movesMade + Math.abs(nodeB.row - finishNode.row) + Math.abs(nodeB.col - finishNode.col)));
}

// function getAllNodes(grid) {
//   const nodes = [];
//   for (const row of grid) {
//     for (const node of row) {
//       node.isVisited = false;
//       node.previousNode = false;
//       nodes.push(node);
//     }
//   }
//   return nodes;
// }

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