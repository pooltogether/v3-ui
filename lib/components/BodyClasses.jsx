import { useEffect } from 'react'
import { isMobile } from 'react-device-detect'
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

  return null
}
