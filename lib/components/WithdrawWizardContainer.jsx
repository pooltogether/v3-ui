import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Wizard, WizardStep } from 'react-wizard-primitive'
import { useRouter } from 'next/router'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { DepositAndWithdrawFormUsersBalance } from 'lib/components/DepositAndWithdrawFormUsersBalance'
import { NoFeeInstantWithdrawal } from 'lib/components/NoFeeInstantWithdrawal'
import { InstantOrScheduledForm } from 'lib/components/InstantOrScheduledForm'
import { TicketQuantityForm } from 'lib/components/TicketQuantityForm'
import { WithdrawComplete } from 'lib/components/WithdrawComplete'
import { WizardLayout } from 'lib/components/WizardLayout'
import { fetchExitFees } from 'lib/utils/fetchExitFees'

export const WithdrawWizardContainer = (props) => {
  const router = useRouter()
  const quantity = router.query.quantity

  let initialStepIndex = 0
  if (quantity) {
    initialStepIndex = 1
  }

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, networkName } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const {
    pool,
    usersTicketBalance
  } = poolData

  const { 
    prizeStrategyAddress
  } = pool || {}
  const ticketAddress = pool && pool.ticket

  const [exitFees, setExitFees] = useState({})
  const [cachedUsersBalance, setCachedUsersBalance] = useState(usersTicketBalance)

  let hasEnoughCreditForInstant = null
  if (exitFees && exitFees.instantCredit) {
    console.log('###################')
    console.log({ instantCredit: exitFees.instantCredit.toString() })
    console.log({ instantFee: exitFees.instantFee.toString() })
    console.log('*********************')
    console.log({ timelockCredit: exitFees.timelockCredit.toString() })
    console.log({ timelockDuration: exitFees.timelockDuration.toString() })
    hasEnoughCreditForInstant = exitFees.instantCredit.gt(0)
  }

  useEffect(() => {
    setCachedUsersBalance(usersTicketBalance)
  }, [usersTicketBalance])


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

    if (quantity) {
      getFees()
    }
  }, [quantity])
  
  let balanceJsx = null
  let underlyingCollateralDecimals = 18
  if (pool) {
    underlyingCollateralDecimals = pool.underlyingCollateralDecimals

    balanceJsx = <DepositAndWithdrawFormUsersBalance
      label='Your ticket balance:'
      start={cachedUsersBalance || usersTicketBalance}
      end={usersTicketBalance}
    />
  }

  return <>
    <Wizard
      initialStepIndex={initialStepIndex}
    >
      {
        (wizard) => {
          const { activeStepIndex, previousStep, moveToStep } = wizard

          return <WizardLayout
            currentWizardStep={activeStepIndex + 1}
            handlePreviousStep={previousStep}
            moveToStep={moveToStep}
            totalWizardSteps={4}
          >
            <WizardStep>
              {(step) => {
                return step.isActive && <>
                  <TicketQuantityForm
                    balanceJsx={balanceJsx}
                    formName='Withdraw'
                    nextStep={step.nextStep}
                    usersTicketBalance={usersTicketBalance}
                    underlyingCollateralDecimals={underlyingCollateralDecimals}
                  />
                </>
              }}
            </WizardStep>

            <WizardStep>
              {(step) => {
                if (!step.isActive) {
                  return null
                }
                return hasEnoughCreditForInstant === null ? <>
                  <div className='text-inverse'>
                    Getting available credit ...
                  </div>
                </> :
                  hasEnoughCreditForInstant ?
                    <NoFeeInstantWithdrawal
                      nextStep={step.nextStep}
                      previousStep={step.previousStep}
                    /> :
                    <InstantOrScheduledForm
                      pool={pool}
                      exitFees={exitFees}
                      nextStep={step.nextStep}
                      quantity={quantity}
                    />
              }}
            </WizardStep>

            <WizardStep>
              {(step) => {
                return step.isActive && <>
                  <WithdrawComplete />
                </>
              }}
            </WizardStep>
          </WizardLayout>
        }
      }
    </Wizard>
  </>
}
