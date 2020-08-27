export const networkColorClassname = (chainId) => {
  if (chainId === 4) {
    return 'yellow'
  } else if (chainId === 3) {
    return 'red'
  } else if (chainId === 5) {
    return 'blue'
  } else if (chainId === 1234) {
    return 'teal'
  } else if (chainId === 42) {
    return 'purple'
  } else {
    return 'darkened'
  }
}

// default-soft