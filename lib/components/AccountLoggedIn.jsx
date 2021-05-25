import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useUsersAddress } from '@pooltogether/hooks'

import { SELECTED_WALLET_COOKIE_KEY } from 'lib/constants'

const MILLISECOND_BEFORE_FAST_REDIRECT = 500
const MILLISECONDS_BEFORE_REDIRECT = 2000

export function AccountLoggedIn(props) {
  const router = useRouter()

  const usersAddress = useUsersAddress()

  const selectedWallet = Cookies.get(SELECTED_WALLET_COOKIE_KEY)

  const redirectToSignIn = () => {
    router.push('/account', '/account')
  }

  useEffect(() => {
    let redirectTimeoutHandler

    if (!selectedWallet) {
      redirectTimeoutHandler = setTimeout(redirectToSignIn, MILLISECOND_BEFORE_FAST_REDIRECT)
    } else if (!usersAddress) {
      // This state happens when we haven't yet calculated the usersAddress from the provider
      // yet we know they've connected a wallet previously
      redirectTimeoutHandler = setTimeout(redirectToSignIn, MILLISECONDS_BEFORE_REDIRECT)
    } else if (redirectTimeoutHandler) {
      clearTimeout(redirectTimeoutHandler)
    }

    return () => {
      clearTimeout(redirectTimeoutHandler)
    }
  }, [selectedWallet, usersAddress])

  return props.children
}
