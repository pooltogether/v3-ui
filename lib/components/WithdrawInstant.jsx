import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { ConfirmWithdrawInstantNoFee } from 'lib/components/ConfirmWithdrawInstantNoFee'
import { InstantForm } from 'lib/components/InstantForm'
import { PaneTitle } from 'lib/components/PaneTitle'
import { fetchExitFees } from 'lib/utils/fetchExitFees'
import { useInterval } from 'lib/hooks/useInterval'

export function WithdrawInstant(props) {
  const { t } = useTranslation()

  const {
    pool,
    quantity,
    nextStep,
    previousStep,
    setTotalWizardSteps,
  } = props

  const { paused } = useContext(GeneralContext)
  const { usersAddress, networkName } = useContext(AuthControllerContext)

  const poolAddress = pool?.poolAddress
  const ticketAddress = pool?.prizeStrategy?.singleRandomWinner?.ticket?.id

  const [exitFees, setExitFees] = useState({})
 
  let underlyingCollateralDecimals = 18
  underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals


  let notEnoughCredit = null
  if (exitFees && exitFees.exitFee) {
    notEnoughCredit = exitFees.exitFee.gt(0)
  }

  useEffect(() => {
    setTotalWizardSteps(notEnoughCredit ? 4 : 3)
  }, [notEnoughCredit])

  useEffect(() => {
    if (exitFees === 'error') {
      poolToast.error('There was an error fetching exit fees')
      previousStep()
    }
  }, [exitFees])

  

  const getFees = async () => {
    const quantityBN = ethers.utils.parseUnits(
      quantity,
      Number(underlyingCollateralDecimals)
    )

    const result = await fetchExitFees(
      networkName,
      usersAddress,
      poolAddress,
      ticketAddress,
      quantityBN
    )

    setExitFees(result)
  }

  useInterval(() => {
    getFees()
  }, paused ? null : MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    const ready = quantity && usersAddress && networkName && ticketAddress && poolAddress && networkName
    if (ready) {
      getFees()
    }
    // OPTIMIZE: Could reset the interval loop here since we just grabbed fresh data!
  }, [
    quantity,
    usersAddress,
    networkName,
    ticketAddress,
    poolAddress,
    networkName
  ])
  
  return <>
    {notEnoughCredit === null ? <>
      <PaneTitle small>
        {t('gettingAvailableCredit')}
      </PaneTitle>
    </> :
      notEnoughCredit ?
        <InstantForm
          pool={pool}
          exitFees={exitFees}
          nextStep={nextStep}
          quantity={quantity}
        /> :
        <ConfirmWithdrawInstantNoFee
          nextStep={nextStep}
          previousStep={previousStep}
        />
    }
  </>
}
