import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

export const AccountLoggedIn = (props) => {
  const router = useRouter()

  const authDataContext = useContext(AuthControllerContext)
  const { usersAddress } = authDataContext
  
  useEffect(() => {
    let redirectTimeoutHandler
    
    if (!usersAddress) {
      console.log({ usersAddress})
      redirectTimeoutHandler = setTimeout(() => {
        router.push('/?signIn=1', '/?signIn=1', { shallow: true })
      }, 1000)
    } else if (redirectTimeoutHandler) {
      clearTimeout(redirectTimeoutHandler)
    }

    return () => {
      clearTimeout(redirectTimeoutHandler)
    }
  }, [usersAddress])

  return props.children
}
