import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

const MILLISECONDS_BEFORE_REDIRECT = 2000

export const AccountLoggedIn = (props) => {
  const router = useRouter()

  const authDataContext = useContext(AuthControllerContext)
  const { usersAddress } = authDataContext

  useEffect(() => {
    let redirectTimeoutHandler

    if (!usersAddress) {
      redirectTimeoutHandler = setTimeout(() => {
        router.push(
          '/account?signIn=1',
          '/account?signIn=1',
          { shallow: true }
        )
      }, MILLISECONDS_BEFORE_REDIRECT)
    } else if (redirectTimeoutHandler) {
      clearTimeout(redirectTimeoutHandler)
    }

    return () => {
      clearTimeout(redirectTimeoutHandler)
    }
  }, [usersAddress])

  return props.children
}
