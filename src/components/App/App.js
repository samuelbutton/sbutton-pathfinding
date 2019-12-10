import React, {Component} from 'react';
import './App.css';
import PathfindingVisualizer from '../PathfindingVisualizer/PathfindingVisualizer'
import Toolbar from '../Toolbar/Toolbar'
import SideDrawer from '../SideDrawer/SideDrawer'
import Backdrop from '../Backdrop/Backdrop'

class App extends Component {
	constructor(props) {
		super(props);
		this.pathfindElement = React.createRef();
	}

	state = {
		sideDrawerOpen: false,
		alertOpen: false,
		selection: undefined
	};

	drawerToggleClickHandler = () => {
		this.setState((prevState) => {
			return {sideDrawerOpen: !prevState.sideDrawerOpen};
		});
	};
	alertToggleHandler = (adjustSideDrawer) => {
		if (adjustSideDrawer) {
			this.setState((prevState) => {
				return {sideDrawerOpen: !prevState.sideDrawerOpen};
			});
		} else {
			this.setState((prevState) => {
				return {alertOpen: !prevState.alertOpen};
			});
		}
	};
	backdropClickHandler = () => {
		this.setState({sideDrawerOpen: false});
		if (this.state.alertOpen) this.pathfindElement.current.alertCloseHandler();
	};
	visualClickHandler = () => {
		this.setState({sideDrawerOpen: false, alertOpen: false});
		this.pathfindElement.current.visualizeAlgorithm(true);
	};
	clearVizClickHandler = () => {
		this.setState({sideDrawerOpen: false, alertOpen: false});
		this.pathfindElement.current.clearVisualization(true);
	};
	selectionChangeHandler = (event) => {
		this.pathfindElement.current.setAlgorithm(event.target.value);
		this.setState({selection: event.target.value});
	};
	mazeGenerateHandler = (event) => {
		this.setState({sideDrawerOpen: false});
		this.pathfindElement.current.generateMaze();
	};

	render() {
		let backdrop;
		if (this.state.sideDrawerOpen || this.state.alertOpen) {
			backdrop = <Backdrop click={this.backdropClickHandler}/>;
		}
		return (
			<div className="App" style={{height: '100%'}}>
			  <Toolbar drawerClickHandler={this.drawerToggleClickHandler} vizClickHandler={this.visualClickHandler} 
			  clearClickHandler={this.clearVizClickHandler} changeHandler={this.selectionChangeHandler} 
			  mazeHandler={this.mazeGenerateHandler}/>
			  <SideDrawer show={this.state.sideDrawerOpen} vizClickHandler={this.visualClickHandler} 
			  clearClickHandler={this.clearVizClickHandler} changeHandler={this.selectionChangeHandler}
			  selection={this.state.selection} mazeHandler={this.mazeGenerateHandler}/>
			  {backdrop}
			  
			  <main style={{marginTop: '64px'}}>
			  	<PathfindingVisualizer className='pathViz' ref={this.pathfindElement} 
			  	alertHandler={this.alertToggleHandler} />
			  </main>
			</div>
		);
	}
}

export default App;