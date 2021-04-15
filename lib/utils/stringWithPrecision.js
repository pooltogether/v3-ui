/**
 * Slices a number string to the requested precision
 * @param {*} val
 * @param {*} options
 * @returns
 */
export function stringWithPrecision(val, options = {}) {
  let precision = 2
  if (options.precision !== undefined) {
    precision = options.precision
  }

  val = val.toString()

  if (val && typeof val.indexOf === 'function') {
    const extraChars = precision ? precision + 1 : 0
    return val.substr(0, val.indexOf('.') + extraChars)
  } else {
    return val
  }
}
