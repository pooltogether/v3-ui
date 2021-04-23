import React, { useEffect } from 'react'

import { useTranslation } from 'lib/../i18n'
import { ConfirmWithdrawNoFee } from 'lib/components/ConfirmWithdrawNoFee'
import { ConfirmWithdrawWithFee } from 'lib/components/ConfirmWithdrawWithFee'
import { PaneTitle } from 'lib/components/PaneTitle'
import { useExitFees } from 'lib/hooks/useExitFees'

export function WithdrawInstant(props) {
  const { t } = useTranslation()

  const { quantity, nextStep, previousStep, setTotalWizardSteps, pool } = props

  const { exitFees } = useExitFees(pool, quantity)

  let notEnoughCredit = null
  if (exitFees && exitFees.exitFee) {
    notEnoughCredit = exitFees.exitFee.gt(0)
  }

  useEffect(() => {
    if (notEnoughCredit) {
      console.log({ notEnoughCredit })
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
        <>
          <PaneTitle>{t('gettingAvailableCredit')}</PaneTitle>
        </>
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
