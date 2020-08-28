import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

export const AccountLoggedIn = (props) => {
  const router = useRouter()

  const authDataContext = useContext(AuthControllerContext)
  const { usersAddress } = authDataContext
  // console.log({ usersAddress})
  
  useEffect(() => {
    // console.log('1')

    let redirectTimeoutHandler
    
    if (!usersAddress) {
      // console.log(usersAddress)
      redirectTimeoutHandler = setTimeout(() => {
        // console.log('in redirect')

        router.push(
          '/account?signIn=1',
          '/account?signIn=1',
          { shallow: true }
        )
      }, 1000)
    } else if (redirectTimeoutHandler) {
      console.log('clear timeout!')
      clearTimeout(redirectTimeoutHandler)
    }

    return () => {
      clearTimeout(redirectTimeoutHandler)
    }
  }, [usersAddress])

  return props.children
}
