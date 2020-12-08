const expression = /^(\w{6})\w*(\w{4})$/

export const shorten = (hash) => {
  let result

  if (!hash) { return null }

  // TODO: Remove once subgraph is fixed
  if (hash.length < 10) return hash

  result = expression.exec(hash)

  return `${result[1]}..${result[2]}`
}
