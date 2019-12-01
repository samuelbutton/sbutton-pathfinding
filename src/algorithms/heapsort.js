export function getHeapSortAnimations(array) {
  return getHeapSort(array, true);
}

export function getHeapSortArray(array) {
  return getHeapSort(array, false);
}

function getHeapSort(array, returnAnimations) {
  const animations = [];
  if (array.length <= 1) return array;
  heapSortHelper(array, animations);
  if (returnAnimations) return animations;
  return array;
}

function heapSortHelper(array, animations) {
	let N = array.length;
	let newArray = [0];
	for (let i = 0; i < N; i++)
		newArray.push(array[i]);
	for (let k = Math.floor(N / 2); k >= 1; k--)
		sink(newArray, k, N, animations, true);
	while (N > 1) {
		exch(newArray, 1, N, animations, false);
		sink(newArray, 1, --N, animations, false);
	}
	for (let i = 0; i < array.length; i++) {
		array[i] = newArray[i+1];
	}
}

function sink(
	array,
	index,
	N,
	animations,
	isHeapBuild
) {
	while (2 * index <= N) {
		let j = 2 * index;
		if (j < N && array[j] < array[j+1]) j++;
		if (array[index] > array[j]) break;
		exch(array, index, j, animations, isHeapBuild);
		index = j;
	}
}

function exch(
  array, 
  idx1, 
  idx2,
  animations,
  isHeapBuild
  ) {
  let isBuild = isHeapBuild ? 1 : 0;
  let temp = array[idx1];
  array[idx1] = array[idx2];
  array[idx2] = temp;
  animations.push([isBuild, idx1 - 1, idx2 - 1]);
  animations.push([isBuild, idx1 - 1, idx2 - 1]);
}