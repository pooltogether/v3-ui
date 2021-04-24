import React, { useEffect } from 'react'
import Loader from 'react-loader-spinner'
import { useAtom } from 'jotai'

import { useTranslation } from 'lib/../i18n'
import { instantWithFeeAtom } from 'lib/atoms/instantWithFeeAtom'
import { ConfirmWithdrawNoFee } from 'lib/components/ConfirmWithdrawNoFee'
import { ConfirmWithdrawWithFee } from 'lib/components/ConfirmWithdrawWithFee'
import { PaneTitle } from 'lib/components/PaneTitle'
import { useExitFees } from 'lib/hooks/useExitFees'

export function WithdrawInstant(props) {
  const { t } = useTranslation()

  const { quantity, nextStep, previousStep, totalWizardSteps, setTotalWizardSteps, pool } = props

  const { exitFees } = useExitFees(pool, quantity)

  const [, setInstantWithFee] = useAtom(instantWithFeeAtom)

  let notEnoughCredit = null
  if (exitFees && exitFees.exitFee) {
    notEnoughCredit = exitFees.exitFee.gt(0)
    setInstantWithFee(true)
  }

  useEffect(() => {
    if (notEnoughCredit) {
      setTotalWizardSteps(totalWizardSteps + 1)
    }
  }, [notEnoughCredit])

  useEffect(() => {
    if (exitFees === 'error') {
      poolToast.error('There was an error fetching exit fees')
      previousStep()
    }
  }, [exitFees])

  return (
    <>
      {notEnoughCredit === null ? (
        <div className='flex flex-col justify-center'>
          <Loader type='Oval' height={40} width={40} color='#bbb2ce' className='mx-auto mb-2' />
          <PaneTitle>{t('gettingAvailableCredit')}</PaneTitle>
        </div>
      ) : notEnoughCredit ? (
        <ConfirmWithdrawWithFee
          pool={pool}
          nextStep={nextStep}
          previousStep={previousStep}
          exitFees={exitFees}
        />
      ) : (
        <ConfirmWithdrawNoFee pool={pool} nextStep={nextStep} previousStep={previousStep} />
      )}
    </>
  )
}
