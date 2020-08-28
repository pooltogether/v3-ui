import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { SignInForm } from 'lib/components/SignInForm'

export const DepositWizardSignIn = (props) => {
  const { nextStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const walletContext = useContext(WalletContext)
  const { handleLoadOnboard } = walletContext

  // lazy load onboardjs when sign-in is shown
  useEffect(() => {
    console.log('handleLoadOnboard deposit wizard sign in form')
    handleLoadOnboard()
  }, [])

  return <>
    <PaneTitle small>
      {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      Connect a wallet to continue:
    </PaneTitle>
    {/* <PaneTitle>
      Enter your email address to continue.
    </PaneTitle> */}

    <div className='flex flex-col mx-auto w-full'>
      <SignInForm
        descriptionClassName='mb-10 xs:w-1/2 sm:w-1/2 lg:w-full mx-auto'
        postSignInCallback={nextStep}
      />
    </div>
  </>
}
