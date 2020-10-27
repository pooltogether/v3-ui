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

    console.log('mount')

    if (!usersAddress) {
      redirectTimeoutHandler = setTimeout(() => {
        console.log('show')
        router.push(
          '/account?signIn=1',
          '/account?signIn=1',
          { shallow: true }
        )
      }, MILLISECONDS_BEFORE_REDIRECT)
    } else if (redirectTimeoutHandler) {
      console.log('clear')
      clearTimeout(redirectTimeoutHandler)
    }

    return () => {
      console.log('clear')
      clearTimeout(redirectTimeoutHandler)
    }
  }, [usersAddress])

  return props.children
}
