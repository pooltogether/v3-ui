import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { SignInForm } from 'lib/components/SignInForm'

export const DepositWizardSignIn = (props) => {
  const { t } = useTranslation()
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
      {t('amountTickets', {
        amount: quantity
      })}
    </PaneTitle>

    <PaneTitle>
      {t('connectAWalletToContinue')}
    </PaneTitle>

    <div className='flex flex-col mx-auto w-full'>
      <SignInForm
        descriptionClassName='mb-10 xs:w-3/4 sm:w-1/2 lg:w-full mx-auto'
        postSignInCallback={nextStep}
      />
    </div>
  </>
}
