import React from 'react';
import {getMergeSortAnimations, getMergeSortArray} from '../algorithms/mergesort.js';
import {getQuickSortAnimations, getQuickSortArray} from '../algorithms/quicksort.js';
import {getHeapSortAnimations, getHeapSortArray} from '../algorithms/heapsort.js';
import './SortingVisualizer.css';

// TODO: freeze functionality if a visualization is running

const ANIMATION_SPEED_MS = 20;
const NUMBER_OF_ARRAY_BARS = 100;
const PRIMARY_COLOR = 'turquoise';
const SECONDARY_COLOR = 'red';
const TERTIARY_COLOR = 'green';

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 730));
    }
    this.setState({array});
  }

  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
    setTimeout(() => {
        const newArray = getMergeSortArray(this.state.array);
        this.setState({array: newArray});
    }, animations.length * ANIMATION_SPEED_MS);
  }

  quickSort() {
    let auxArray = this.state.array.slice()
    const animations = getQuickSortAnimations(auxArray);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const [legend, barOneIdx, barTwoIdx] = animations[i];
      let isPartitionChange = legend === 1;
      if (isPartitionChange) {
        const barOneStyle = arrayBars[barOneIdx].style;
        setTimeout(() => {
          barOneStyle.backgroundColor = TERTIARY_COLOR;
        }, i * ANIMATION_SPEED_MS);
      } else {
        let isBarExchange = legend === 2;
        let color = isBarExchange ? SECONDARY_COLOR : PRIMARY_COLOR;
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
        if (isBarExchange)
          setTimeout(() => {
            let temp = barOneStyle.height;
            barOneStyle.height = barTwoStyle.height;
            barTwoStyle.height = temp;
          }, i * ANIMATION_SPEED_MS);
      }
    }
    setTimeout(() => {
        const newArray = getQuickSortArray(auxArray);
        this.setState({array: newArray});
    }, animations.length * ANIMATION_SPEED_MS);
  }

  heapSort() {
    let auxArray = this.state.array.slice()
    const animations = getHeapSortAnimations(auxArray);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const [isBuild, barOneIdx, barTwoIdx] = animations[i];
      let isHeapBuild = isBuild === 1, isBarExchange = i % 2 === 0;
      let color;
      if (isHeapBuild) color = isBarExchange ? TERTIARY_COLOR : PRIMARY_COLOR;
      else color = isBarExchange ? SECONDARY_COLOR : PRIMARY_COLOR;
      const barOneStyle = arrayBars[barOneIdx].style;
      const barTwoStyle = arrayBars[barTwoIdx].style;
      setTimeout(() => {
        barOneStyle.backgroundColor = color;
        barTwoStyle.backgroundColor = color;
      }, i * ANIMATION_SPEED_MS);
      if (isBarExchange)
        setTimeout(() => {
          let temp = barOneStyle.height;
          barOneStyle.height = barTwoStyle.height;
          barTwoStyle.height = temp;
        }, i * ANIMATION_SPEED_MS);
    }
    setTimeout(() => {
        const newArray = getHeapSortArray(auxArray);
        this.setState({array: newArray});
    }, animations.length * ANIMATION_SPEED_MS);
  }

  bubbleSort() {
    
  }

  testSortingAlgorithms() {
    for (let i = 0; i < 100; i++) {
      const array = [];
      const length = randomIntFromInterval(1, 1000);
      for (let i = 0; i < length; i++) {
        array.push(randomIntFromInterval(-1000, 1000));
      }
      const javaScriptSortedArray = array.slice().sort((a, b) => a - b);
      const mergeSortedArray = getMergeSortArray(array.slice());
      const quickSortedArray = getQuickSortArray(array.slice());
      const heapSortedArray = getHeapSortArray(array.slice());
      console.log(arraysAreEqual(javaScriptSortedArray, heapSortedArray));
    }
  }

  render() {
    const {array} = this.state;

    return (
      <>
      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              backgroundColor: PRIMARY_COLOR,
              height: `${value}px`,
            }}></div>
        ))}       
      </div>
      <div className="menu-container">
       <button onClick={() => this.resetArray()}>Generate New Array</button>
        <button onClick={() => this.mergeSort()}>Merge Sort</button>
        <button onClick={() => this.quickSort()}>Quick Sort</button>
        <button onClick={() => this.heapSort()}>Heap Sort</button>
        
        <button onClick={() => this.testSortingAlgorithms()}>
          Test Sorting Algorithms (BROKEN)
        </button>
      </div>
      </>
    );
  }
}

 // <button onClick={() => this.bubbleSort()}>Bubble Sort</button>


// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function arraysAreEqual(arrayOne, arrayTwo) {
  if (arrayOne.length !== arrayTwo.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    if (arrayOne[i] !== arrayTwo[i]) {
      return false;
    }
  }
  return true;
}
