import React, {Component} from 'react';
import './App.css';
import PathfindingVisualizer from '../PathfindingVisualizer/PathfindingVisualizer'
// import SortingVisualizer from './components/SortingVisualizer/SortingVisualizer'
import Toolbar from '../Toolbar/Toolbar'
import SideDrawer from '../SideDrawer/SideDrawer'
import Backdrop from '../Backdrop/Backdrop'

class App extends Component {
	state = {
		sideDrawerOpen: false
	};

	drawerToggleClickHandler = () => {
		this.setState((prevState) => {
			return {sideDrawerOpen: !prevState.sideDrawerOpen};
		});
	};
	backdropClickHandler = () => {
		this.setState({sideDrawerOpen: false});
	};
	

	render() {
		let backdrop;
		if (this.state.sideDrawerOpen) {
			backdrop = <Backdrop click={this.backdropClickHandler}/>;
		}
		return (
			<div className="App" style={{height: '100%'}}>
			  <Toolbar drawerClickHandler={this.drawerToggleClickHandler} />
			  <SideDrawer show={this.state.sideDrawerOpen}/>
			  {backdrop}
			  <main style={{marginTop: '64px'}}>
			  	<PathfindingVisualizer />
			  </main>
			</div>
		);
	}
}

// <SortingVisualizer></SortingVisualizer>
// 

export default App;