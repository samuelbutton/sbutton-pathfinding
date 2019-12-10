import React from 'react';

import './SideDrawer.css';

const sideDrawer = props => {
	let drawerClasses = 'side-drawer';
	if (props.show) {
		drawerClasses = 'side-drawer open';
	}
	let initalValue = '[Choose Algorithm]';
	if (props.selection !== undefined) initalValue = props.selection;
	return (
		<nav className={drawerClasses}>
			<ul>
				<li>
					<select onChange={props.changeHandler} value={initalValue}>
						<option className="initialSelection" value="init">[Choose Algorithm]</option>
						<option value="dijkstra">Dijkstra</option>
						<option value="aStar">A* Manhattan</option>
						<option value="aStar">Best-first</option>
						<option value="bfs">Breadth-first</option>
						<option value="bidirectional">Bidirectional BFS</option>
						<option value="dfs">Depth-first</option>
					</select>
				</li>
				<li><button onClick={props.vizClickHandler}>Visualize!</button></li>
				<li><button onClick={props.clearClickHandler}>Clear Visualization</button></li>
				<li><button onClick={props.mazeHandler}>Generate Maze</button></li>
			</ul>
		</nav>
	);
};

export default sideDrawer;
