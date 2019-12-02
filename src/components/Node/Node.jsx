import React, {Component} from 'react';
import './Node.css';

export default class Node extends Component {
	// could change the node every time we render it
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;
    // the above uses props to define the aspects of the Node
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col, isStart, isFinish)}
        onMouseEnter={() => onMouseEnter(row, col, isStart, isFinish)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}