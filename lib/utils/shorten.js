const expression = /^(\w{6})\w*(\w{4})$/

export function shorten (hash) {
  let result

  if (!hash) { return null }

  result = expression.exec(hash)

  return `${result[1]}..${result[2]}`
}
