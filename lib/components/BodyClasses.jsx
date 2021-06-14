import { useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { useInterval } from 'beautiful-react-hooks'
import { useRouter } from 'next/router'

export function BodyClasses(props) {
  const router = useRouter()

  const deposit = /deposit/.test(router.asPath)
  const manage = /\/manage-tickets/.test(router.asPath)

  const checkoutFlowOpen = deposit || manage

  useEffect(() => {
    const body = document.body
    if (isMobile) {
      body.classList.add('device-is-touch')
    } else {
      body.classList.remove('device-is-touch')
    }
  }, [isMobile])

  useEffect(() => {
    const body = document.body
    if (checkoutFlowOpen) {
      body.classList.add('overflow-y-hidden')
    } else {
      body.classList.remove('overflow-y-hidden')
    }
  }, [checkoutFlowOpen])

  // When next.js loads in production and encounters an error (such as the nefarious ChunkLoadError)
  // it adds 'overflow-hidden' to the body to show an error msg (but then never shows the error)
  // This reverses that dumb class modification
  useInterval(() => {
    const body = document.body
    if (body.classList.contains('overflow-hidden')) {
      body.classList.remove('overflow-hidden')
    }
  }, 1000)

  return null
}
