export async function bestFirst(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const candidates = new Array(getNumberOfNodes(grid));
  startNode.distance = getManhattanDistance(startNode, finishNode);
  startNode.isVisited = true;
  search(grid, visitedNodesInOrder, candidates, startNode, finishNode);
  return visitedNodesInOrder;
}


function search(grid, visitedNodesInOrder, candidates, startNode, finishNode) {
  let N = insert(startNode, candidates, 0);
  while (candidates.length !== 0) { 
    const node = delMin(candidates, N--);
    visitedNodesInOrder.push(node);
    if (node !== null && node.isFinish) break;
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

    for (const neighbor of unvisitedNeighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = node;
      neighbor.distance = getManhattanDistance(neighbor, finishNode);
      N = insert(neighbor, candidates, N);
    }
  }
}

 function delMin(candidates, N) {
    const min = candidates[1];
    exch(candidates, 1, N--);
    sink(candidates, 1, N);
    candidates[N+1] = undefined;
    return min;
 }

 function sink(array, index, N) {
  while (2 * index <= N) {
    let j = 2 * index;
    if (j < N && less(array, j+1, j)) j++;
    if (less(array, index, j)) break;
    exch(array, index, j);
    index = j;
  }
}

function insert(node, candidates, N) {
  candidates[++N] = node;
  swim(N, candidates); 
  return N;
}

function swim(index, candidates) {
   while (index > 1 && less(candidates, index, Math.floor(index/2))) {
      exch(candidates, index, Math.floor(index/2));
      index = Math.floor(index/2);
    }
}

function exch(array, ind1, ind2) {
  const temp = array[ind1];
  array[ind1] = array[ind2];
  array[ind2] = temp;
}

function less(array, ind1, ind2) {
  return array[ind1].distance < array[ind2].distance;
}

function getManhattanDistance(node, finishNode) {
  return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
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

function getNumberOfNodes(grid) {
  return grid.length * grid[0].length;
}