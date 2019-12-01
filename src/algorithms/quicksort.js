  // partition the array based on the first value, moving two pointers incrementally
  // until a condition is met, than exchanging the two
  // if the two pointers cross, we exechange the partition element with the less than element
  // then, we recursively sort the left half of the partition and the right half of the partition

  // so need method that takes (partitionInd, startInd, endInd)
  // can pass in array reference because we always execute on the same array reference but on different parts
  // synchronously as well

export function getQuickSortAnimations(array) {
  return getQuickSort(array, true);
}

export function getQuickSortArray(array) {
  return getQuickSort(array, false);
}

function getQuickSort(array, returnAnimations) {
  const animations = [];
  if (array.length <= 1) return array;
  quickSortHelper(array, 0, array.length - 1, animations);
  if (returnAnimations) return animations;
  return array;
}

function quickSortHelper(
  mainArray, 
  startIdx,
  endIdx,
  animations,
) {
  if (endIdx <= startIdx) return;
  let j = partition(mainArray, startIdx, endIdx, animations);
  // some kind of animation work with j, exchanging perhaps
  quickSortHelper(mainArray, startIdx, j-1, animations);
  quickSortHelper(mainArray, j+1, endIdx, animations);
}

function partition(
  mainArray, 
  startIdx,
  endIdx,
  animations
) {
  let i = startIdx, j = endIdx + 1;
  // animation 1 will represent the partition element under consideration
  animations.push([1, startIdx, startIdx]); // could maybe remove animmation index in favor of equality tests in the future (TBD)
  while (true) {
    while (mainArray[++i] < mainArray[startIdx]) 
      if (i === endIdx) break;
    while (mainArray[startIdx] < mainArray[--j])
      if (j === startIdx) break;
    if (i >= j) break;
    exch(mainArray, i, j);
    // animation 2 will be switching two elements
    animations.push([2, i, j]);
    animations.push([3, i, j]);
  }
  // animation 3 will be switching the partition element with another element
  exch(mainArray, startIdx, j);
  animations.push([2, startIdx, j]);
  animations.push([3, startIdx, j]);
  return j;
}

function exch(
  mainArray, 
  idx1, 
  idx2
  ) {
  let temp = mainArray[idx1];
  mainArray[idx1] = mainArray[idx2];
  mainArray[idx2] = temp;
}

