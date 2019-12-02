import React from 'react';

import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';
import './Toolbar.css';

const toolbar = props => (
	<header className="toolbar">
		<nav className ="toolbar_navigation">
			<div className="toolbar_toggle-button">
				<DrawerToggleButton click={props.drawerClickHandler}/>
			</div>
			<div className="toolbar_logo"><a href="/">Pathfinding Visualizer</a></div>
			
			<div className="toolbar_navigation-items">
				<ul>
					<li><a href="/">Visualize Dijkstra's Algorithm</a></li>
					<li><a href="/">Clear Walls</a></li>
					<li><a href="/">Clear Visualization</a></li>
				</ul>
			</div>
			<div className="spacer" />
		</nav>
	</header>
	);

export default toolbar;