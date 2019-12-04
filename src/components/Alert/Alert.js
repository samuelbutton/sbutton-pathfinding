import React from 'react';
import './Alert.css'

const alert = props => (
	<div className="alert-box">
		<button className="alert-button" onClick={props.click}>
			<div className="alert-button_line left" />
			<div className="alert-button_line right" />
		</button>
		Choose an algorithm!
	</div>
);

export default alert;