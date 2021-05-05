import { useEffect, useState } from 'react'

export const SCREEN_SIZE = Object.freeze({
  xs: 531,
  sm: 941,
  lg: 1481
})

const useScreenSize = () => {
  const { width } = useWindowSize()
  if (!width || width < SCREEN_SIZE.xs) {
    return SCREEN_SIZE.xs
  } else if (width < SCREEN_SIZE.sm) {
    return SCREEN_SIZE.sm
  } else {
    return SCREEN_SIZE.lg
  }
}

export default useScreenSize

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  })
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    // Add event listener
    window.addEventListener('resize', handleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount
  return windowSize
}
