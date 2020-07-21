import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { AccountPoolShowUI } from 'lib/components/AccountPoolShowUI'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

export const AccountLoggedIn = (props) => {
  const router = useRouter()

  const authDataContext = useContext(AuthControllerContext)
  const { usersAddress } = authDataContext
  
  useEffect(() => {
    if (!usersAddress) {
      console.warn('fix this!')
      // router.push('/?signIn=1', '/?signIn=1', { shallow: true })
    }
  }, [])

  return props.children
}
