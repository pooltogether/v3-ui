import React from 'react'
import { useRouter } from 'next/router'

import { PaneTitle } from 'lib/components/PaneTitle'
import { SignInForm } from 'lib/components/SignInForm'

export const DepositWizardSignIn = (props) => {
  const { nextStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const handleContinueClick = (e) => {
    e.preventDefault()
    nextStep()
  }

  return <>
    <PaneTitle small>
      {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      Enter your email address to continue.
    </PaneTitle>

    <div className='flex flex-col mx-auto w-full'>
      <SignInForm />
    </div>
  </>
}
