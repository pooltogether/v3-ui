import { useEffect } from 'react'

export const useDisableScrollWhenMounted = () => {
  useEffect(() => {
    if (document) {
      const content = document.getElementById('content-animation-wrapper')
      content.classList.add('overflow-y-hidden')
    }
    return () => {
      if (document) {
        const content = document.getElementById('content-animation-wrapper')
        content.classList.remove('overflow-y-hidden')
      }
    }
  }, [])
}
