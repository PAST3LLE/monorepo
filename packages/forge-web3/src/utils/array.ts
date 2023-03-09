/**
 * Randomises item index position in given array. Returns a new array
 * @param arr
 * @returns new Array type T
 */
export function randomiseArray<T extends []>(arr: T) {
  const newArr = arr.slice()
  // Start from the last element and swap
  // one by one. We don't need to run for
  // the first element that's why i > 0
  for (let i = arr.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i inclusive
    const j = Math.floor(Math.random() * (i + 1))

    // Swap arr[i] with the element
    // at random index
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }

  return newArr
}
