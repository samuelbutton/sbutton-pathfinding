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
  animations.push([1, startIdx, startIdx]);
  while (true) {
    while (mainArray[++i] < mainArray[startIdx]) 
      if (i === endIdx) break;
    while (mainArray[startIdx] < mainArray[--j])
      if (j === startIdx) break;
    if (i >= j) break;
    exch(mainArray, i, j, animations);
  }
  exch(mainArray, startIdx, j, animations);
  return j;
}

function exch(
  mainArray, 
  idx1, 
  idx2,
  animations
  ) {
  let temp = mainArray[idx1];
  mainArray[idx1] = mainArray[idx2];
  mainArray[idx2] = temp;
  animations.push([2, idx1, idx2]);
  animations.push([3, idx1, idx2]);
}

