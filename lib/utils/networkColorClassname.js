export const networkColorClassname = (networkId) => {
  if (networkId === 4) {
    return 'yellow'
  } else if (networkId === 3) {
    return 'red'
  } else if (networkId === 5) {
    return 'blue'
  } else if (networkId === 1234) {
    return 'teal'
  } else if (networkId === 42) {
    return 'purple'
  }
}
