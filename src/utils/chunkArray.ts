export function chunkArray<T>(arr: T[], chunks: number) {
  const chunkedArray: T[][] = []
  const chunkSize = Math.ceil(arr.length / chunks)

  for (let i = 0; i < arr.length; i += chunkSize) {
    chunkedArray.push(arr.slice(i, i + chunkSize))
  }

  return chunkedArray
}
