import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { NoFeeInstantWithdrawal } from 'lib/components/NoFeeInstantWithdrawal'
import { InstantOrScheduledForm } from 'lib/components/InstantOrScheduledForm'
import { fetchExitFees } from 'lib/utils/fetchExitFees'

export const WithdrawScheduledOrInstantWithFee = (props) => {
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
    console.log('###################')
    console.log('###################')
    console.log('###################')
    console.log({ instantCredit: ethers.utils.formatUnits(exitFees.instantCredit, Number(underlyingCollateralDecimals)) })
    console.log({ instantFee: ethers.utils.formatUnits(exitFees.instantFee, Number(underlyingCollateralDecimals)) })
    console.log({ timelockCredit: ethers.utils.formatUnits(exitFees.timelockCredit, Number(underlyingCollateralDecimals)) })
    console.log({ timelockDuration: exitFees.timelockDuration.toString() })
    hasEnoughCreditForInstant = exitFees.instantFee.lte(0)
  }

  useEffect(() => {
    setTotalWizardSteps(hasEnoughCreditForInstant ? 3 : 4)
  }, [hasEnoughCreditForInstant])

  // TODO: have this use useInterval as well so we always
  // have the updated data!
  useEffect(() => {
    const getFees = async () => {
      const result = await fetchExitFees(
        networkName,
        usersAddress,
        prizeStrategyAddress,
        ticketAddress,
        ethers.utils.parseEther(quantity),
      )
      setExitFees(result)
    }

    const ready = quantity && usersAddress && networkName && ticketAddress && prizeStrategyAddress && networkName
    if (ready) {
      getFees()
    }
  }, [quantity, usersAddress, networkName, ticketAddress, prizeStrategyAddress, networkName])
  
  return <>
    {hasEnoughCreditForInstant === null ? <>
      <div className='text-inverse'>
        Getting available credit ...
      </div>
    </> :
      hasEnoughCreditForInstant ?
        <NoFeeInstantWithdrawal
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
