import React, { useContext, useEffect, useState } from 'react'
import { Wizard, WizardStep } from 'react-wizard-primitive'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { DepositAndWithdrawFormUsersBalance } from 'lib/components/DepositAndWithdrawFormUsersBalance'
import { NoFeeInstantWithdrawal } from 'lib/components/NoFeeInstantWithdrawal'
// import { InstantOrScheduledForm } from 'lib/components/InstantOrScheduledForm'
import { WithdrawComplete } from 'lib/components/WithdrawComplete'
import { TicketQuantityForm } from 'lib/components/TicketQuantityForm'
import { WizardLayout } from 'lib/components/WizardLayout'

export const WithdrawWizardContainer = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, usersTicketBalance } = poolData

  const [cachedUsersBalance, setCachedUsersBalance] = useState(usersTicketBalance)

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

  useEffect(() => {
    setCachedUsersBalance(usersTicketBalance)
  }, [usersTicketBalance])
  
  return <>
    <Wizard>
      {
        (wizard) => {
          const { activeStepIndex, previousStep, moveToStep } = wizard

          return <WizardLayout
            currentWizardStep={activeStepIndex + 1}
            handlePreviousStep={previousStep}
            moveToStep={moveToStep}
            totalWizardSteps={usersAddress ? 5 : 6}
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

            {/* if the player has enough credit to withdraw the amount they've entered */}
            <WizardStep>
              {(step) => {
                return step.isActive && <>
                  <NoFeeInstantWithdrawal
                    nextStep={step.nextStep}
                    previousStep={step.previousStep}
                  />
                </>
              }}
            </WizardStep>

            {/* if the player needs to choose between Scheduled or Instant */}
            {/* <WizardStep>
              {(step) => {
                return step.isActive && <>
                  <InstantOrScheduledForm
                    nextStep={step.nextStep}
                  />
                </>
              }}
            </WizardStep> */}
            
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
