export function maze(grid, startNode, finishNode) {
	const walls = [];
	for (let row of grid) {
		for (let node of row) {
			if (node.row === 0 || node.col === 0 || node.row === grid.length - 1 || node.col === grid[0].length - 1) {
				if (!node.isStart && !node.isFinish) {
					node.isWall = true;
					walls.push(node);
				}				
			}
		} 
	}
	const isHorizontal = choose_orientation(grid[0].length - 2, grid.length - 2);
	divide(grid, 1, 1, grid[0].length - 2, grid.length - 2, isHorizontal, startNode, finishNode, walls)
	
	return [grid, walls];
}

function getX(width, startNode, finishNode, isWall) {
	const addWall = isWall ? 2 : 0;
	const spot = getSpot(width - addWall);
	if (spot === startNode.col || spot === finishNode.col) return getX(width, startNode, finishNode, isWall);
	else return spot;
}

function getY(height, startNode, finishNode, isWall) {
	const addWall = isWall ? 2 : 0;
	const spot = getSpot(height - addWall);
	if (spot === startNode.row || spot === finishNode.row) return getY(height, startNode, finishNode, isWall);
	else return spot;
}

function getSpot(measure) {
	return Math.floor((measure) * Math.random());
}

function divide(grid, x, y, width, height, orientation, startNode, finishNode, walls) {
	if (width < 2 || height < 2) return;
  	const isHorizontal = orientation;

  	let wx = x + (isHorizontal ? 0 : getX(width, startNode, finishNode, true));
  	let wy = y + (isHorizontal ? getY(height, startNode, finishNode, true) : 0);

  	const px = wx + (isHorizontal ? getX(width, startNode, finishNode, false) : 0);
  	const py = wy + (isHorizontal ? 0 : getY(height, startNode, finishNode, false));

  	const dx = isHorizontal ? 1 : 0;
  	const dy = isHorizontal ? 0 : 1;

  	const length = isHorizontal ? width : height;

  	for (let i = 0; i < length; i++) {
  		if ((wx !== px) || (wy !== py)) {
  			const node = grid[wy][wx];
  			if (!node.isStart && !node.isFinish) {
  				node.isWall = true;
  				walls.push(node);
  			}
  		}
    	wx += dx;
    	wy += dy;
	}
	let [nx, ny] = [x, y];

	let [w, h] = isHorizontal ? [width, wy - y] : [wx - x, height];
	divide(grid, nx, ny, w, h, choose_orientation(w, h), startNode, finishNode, walls);

	[nx, ny] = isHorizontal ? [x, wy + 2] : [wx + 2, y];
	[w, h] = isHorizontal ? [width, y - 2 + height - wy] : [x - 2 + width - wx, height];
	divide(grid, nx, ny, w, h, choose_orientation(w, h), startNode, finishNode, walls);
}

function choose_orientation(width, height) {
  if (width < height)
    return true;
  else if (height < width)
    return false;
  else
    return Math.floor(2 * Math.random()) === 0;
}