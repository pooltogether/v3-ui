import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import { AccountButton } from 'lib/components/AccountButton'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const AccountAndSignIn = (props) => {
  const router = useRouter()

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

  const handleShowSignIn = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { signIn: 1 })
  }

  return <>
    <div
      className='text-xxs sm:text-sm text-right'
    >
      {usersAddress ?
        <AccountButton
          usersAddress={usersAddress}
        /> :
        <Button
          outline
          onClick={handleShowSignIn}
        >
          Sign in
        </Button>
      }
    </div>
  </>
    
}
