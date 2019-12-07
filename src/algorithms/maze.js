export function generateMax(grid, startNode, finishNode) {
	const walls = [];
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array[0].length; j++) {
			if (i === 0 || j === 0) {
				const node = array[i][j];
				if (!node.isStart && !node.isFinish) {
					node.isWall = true;
					walls.push([i, j]);
				}				
			}
		} 
	}
	const isHorizontal = choose_orientation(array[0].length, array.length);
	divide(grid, nx, ny, w, h, isHorizontal, startNode, finishNode)


	let wallVisited = new Array(array.length).fill(false).map(() => new Array(array[0].length).fill(false));
	
	return walls;
}

function getX(width, startNode, finishNode, isWall) {
	const addWall = isWall ? 2 : 0;
	const line = getWall(width - addWall);
	if (line == startNode.col || line == finishNode.col) return getWallX(width, startNode, finishNode);
	else return line;
}

function getY(height, startNode, finishNode, isWall) {
	const addWall = isWall ? 2 : 0;
	const line = getWall(height - addWall);
	if (line == startNode.row || line == finishNode.row) return getWallY(height, startNode, finishNode);
	else return line;
}

function getWall(measure) {
	return Math.floor((measure) * Math.random());
}

function divide(grid, x, y, width, height, orientation, startNode, finishNode) {
	if (width < 2 || height < 2) return;
  	const horizontal = orientation;

   	// where will the wall be drawn from?
  	const wx = x + (horizontal ? 0 : getX(width, startNode, finishNode, true));
  	const wy = y + (horizontal ? getY(height, startNode, finishNode, true) : 0);

    // where will the passage through the wall exist?
  	const px = wx + (horizontal ? getX(width, startNode, finishNode, false) : 0);
  	const py = wy + (horizontal ? 0 : getY(height, startNode, finishNode, false));

  	// what direction will the wall be drawn?
  	const dx = horizontal ? 1 : 0;
  	const dy = horizontal ? 0 : 1;

  	// how long will the wall be?
  	const length = horizontal ? width : height

  	// what direction is perpendicular to the wall?
  	const dir = horizontal ? "S" : "E"

  	for (let i = 0; i < length; i++) {
  		if ((wx != px) || (wy != py)) grid[wy][wx] |= dir 
    	wx += dx
    	wy += dy
	}
  nx, ny = x, y
  w, h = horizontal ? [width, wy-y+1] : [wx-x+1, height]
  divide(grid, nx, ny, w, h, choose_orientation(w, h))

  nx, ny = horizontal ? [x, wy+1] : [wx+1, y]
  w, h = horizontal ? [width, y+height-wy-1] : [x+width-wx-1, height]
  divide(grid, nx, ny, w, h, choose_orientation(w, h))


}

function choose_orientation(width, height) {
  if (width < height)
    return true;
  else if (height < width)
    return false;
  else
    return Math.floor(2 * Math.random()) == 0;
}

def divide(grid, x, y, width, height, orientation)
end
