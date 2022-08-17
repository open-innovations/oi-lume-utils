export function transpose<T>(matrix: T[][]) {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

