import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import { AccountButton } from 'lib/components/AccountButton'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { TransactionsUI } from 'lib/components/TransactionsUI'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const NavAccount = (props) => {
  const router = useRouter()

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

  const handleShowSignIn = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { signIn: 1 })
  }

  return <>
    
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
    

    <TransactionsUI />
  </>
    
}
