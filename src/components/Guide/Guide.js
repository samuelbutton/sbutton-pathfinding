import React from 'react';
import './Guide.css'

const guide = props => (
	<div className="guide-box">
		<button className="guide-button" onClick={props.click}>
			<div className="guide-button_line left" />
			<div className="guide-button_line right" />
		</button>
		<p>Visualizing Pathfinding Algorithms</p>
		<ol>
			<li>Choose an algorithm to visualize.</li>
			<li>Add walls to obstruct paths by interacting with the grid.</li>
			<li>Click "Visualize" to find visited nodes and shortest path.</li>
			<li>With a visualization displayed, interact with the grid to make dynamic changes to the path.</li>
		</ol>
	</div>
);

export default guide;