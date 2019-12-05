import React from 'react';

import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';
import './Toolbar.css';

const toolbar = props => (
	<header className="toolbar">
		<nav className ="toolbar_navigation">
			<div className="toolbar_toggle-button">
				<DrawerToggleButton click={props.drawerClickHandler}/>
			</div>
			<div className="toolbar_logo clearButton"><button onClick={props.clearClickHandler}>Pathfinding Visualizer</button></div>
			
			<div className="toolbar_navigation-items">
				<ul>
					<li>
						<select className="selector" onChange={props.changeHandler}>
							<option className="initialSelection" value="init">[Choose Algorithm]</option>
							<option value="dijkstra">Dijkstra</option>
							<option value="aStar">A* Manhattan</option>
							<option value="bfs">Breadth-first</option>
							<option value="bidirectional">Bidirectional BFS</option>
							<option value="dfs">Depth-first</option>
						</select>
					</li>
						
					<li><button  className="vizButton" onClick={props.vizClickHandler}>Visualize!</button></li>
					<li><button  className="clearButton" onClick={props.clearClickHandler}>Clear Visualization</button></li>
				</ul>
			</div>
			<div className="spacer" />
		</nav>
	</header>
	);

export default toolbar;