
/**
 * Return a random int between 0 and max (excluded)
 */
export function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

/**
 * Return a random element of an array
 */
export function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(arr.length)];
}

/**
 * Return n random, different elements of an array
 */
export function randomNChoices<T>(arr: T[], n: number): T[] {
  var indexes = Array.from(Array(arr.length), (_, idx) => idx);
  var selected = []
  for (let i = 0; i < n; i++) {
    const randomIdx = randomChoice(indexes)
    indexes = indexes.filter(idx => idx !== randomIdx);
    selected.push(arr[randomIdx]);
  }
  return selected;
}

/**
 * Shuffle an array
 */
export function randomShuffle<T>(arr: T[]): T[] {
return arr.sort((_, __) => 0.5 - Math.random());
}
