import React, { useEffect } from 'react'
import { poolToast } from '@pooltogether/react-components'

import { useTranslation } from 'react-i18next'
import { ConfirmWithdrawNoFee } from 'lib/components/ConfirmWithdrawNoFee'
import { ConfirmWithdrawWithFee } from 'lib/components/ConfirmWithdrawWithFee'

export function WithdrawInstant(props) {
  const { t } = useTranslation()

  const { exitFees, notEnoughCredit, nextStep, previousStep, pool } = props

  useEffect(() => {
    if (exitFees === 'error') {
      poolToast.error('There was an error fetching exit fees')
      previousStep()
    }
  }, [exitFees])

  return (
    <>
      {notEnoughCredit ? (
        <ConfirmWithdrawWithFee pool={pool} nextStep={nextStep} exitFees={exitFees} />
      ) : (
        <ConfirmWithdrawNoFee pool={pool} nextStep={nextStep} previousStep={previousStep} />
      )}
    </>
  )
}
