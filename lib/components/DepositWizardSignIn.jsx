import React from 'react'
import { useRouter } from 'next/router'

import { PaneTitle } from 'lib/components/PaneTitle'
import { SignInForm } from 'lib/components/SignInForm'

export const DepositWizardSignIn = (props) => {
  const { nextStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

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
        postSignInCallback={nextStep}
      />
    </div>
  </>
}
