import React from 'react';

import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';
import './Toolbar.css';

const toolbar = props => (
	<header className="toolbar">
		<nav className ="toolbar_navigation">
			<div className="toolbar_toggle-button">
				<DrawerToggleButton click={props.drawerClickHandler}/>
			</div>
			<div className="toolbar_logo"><button onClick={props.clearClickHandler}>Pathfinding Visualizer</button></div>
			
			<div className="toolbar_navigation-items">
				<ul>
					<li><button onClick={props.dijClickHandler}>Visualize Dijkstra's Algorithm</button></li>
					<li><button onClick={props.clearClickHandler}>Clear Walls</button></li>
					<li><button onClick={props.clearClickHandler}>Clear Visualization</button></li>
				</ul>
			</div>
			<div className="spacer" />
		</nav>
	</header>
	);

export default toolbar;