import { ConfettiContext } from 'lib/components/contextProviders/ConfettiContextProvider'
import { useContext, useEffect } from 'react'

export const useConfetti = (duration = 300) => {
  const { confetti } = useContext(ConfettiContext)
  useEffect(() => {
    setTimeout(() => {
      window.confettiContext = confetti
      confetti.start(setTimeout, setInterval)
    }, duration)
  }, [])
}
