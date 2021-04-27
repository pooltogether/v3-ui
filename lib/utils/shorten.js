const expression = /^(\w{6})\w*(\w{4})$/

export const shorten = (hash) => {
  let result

  if (!hash) {
    return null
  }

  result = expression.exec(hash)

  try {
    return `${result[1]}..${result[2]}`
  } catch (e) {
    console.warn(e.message)
    return null
  }
}
