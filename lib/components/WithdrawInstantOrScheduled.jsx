import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { ExecuteWithdrawInstantNoFee } from 'lib/components/ExecuteWithdrawInstantNoFee'
import { InstantOrScheduledForm } from 'lib/components/InstantOrScheduledForm'
import { fetchExitFees } from 'lib/utils/fetchExitFees'
import { useInterval } from 'lib/hooks/useInterval'

export const WithdrawInstantOrScheduled = (props) => {
  const {
    pool,
    quantity,
    nextStep,
    previousStep,
    setTotalWizardSteps,
  } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, networkName } = authControllerContext

  const prizeStrategyAddress = pool && pool.prizeStrategyAddress
  const ticketAddress = pool && pool.ticket

  const [exitFees, setExitFees] = useState({})

  let underlyingCollateralDecimals = 18
  underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals

  let hasEnoughCreditForInstant = null
  if (exitFees && exitFees.instantCredit) {
    hasEnoughCreditForInstant = exitFees.instantFee.lte(0)
  }

  useEffect(() => {
    setTotalWizardSteps(hasEnoughCreditForInstant ? 3 : 4)
  }, [hasEnoughCreditForInstant])


  const getFees = async () => {
    const quantityBN = ethers.utils.parseEther(
      quantity,
      Number(underlyingCollateralDecimals)
    )
    const result = await fetchExitFees(
      networkName,
      usersAddress,
      prizeStrategyAddress,
      ticketAddress,
      quantityBN
    )
    setExitFees(result)
  }

  useInterval(() => {
    getFees()
  }, MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    const ready = quantity && usersAddress && networkName && ticketAddress && prizeStrategyAddress && networkName
    if (ready) {
      getFees()
    }
    // OPTIMIZE: Could reset the interval loop here since we just grabbed fresh data!
  }, [quantity, usersAddress, networkName, ticketAddress, prizeStrategyAddress, networkName])
  
  return <>
    {hasEnoughCreditForInstant === null ? <>
      <div className='text-inverse'>
        Getting available credit ...
      </div>
    </> :
      hasEnoughCreditForInstant ?
        <ExecuteWithdrawInstantNoFee
          nextStep={nextStep}
          previousStep={previousStep}
        /> :
        <InstantOrScheduledForm
          pool={pool}
          exitFees={exitFees}
          nextStep={nextStep}
          quantity={quantity}
        />
    }
  </>
}
