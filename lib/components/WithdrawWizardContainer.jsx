import React, { useContext, useEffect, useState } from 'react'
import { Wizard, WizardStep } from 'react-wizard-primitive'
import { useRouter } from 'next/router'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { DepositAndWithdrawFormUsersBalance } from 'lib/components/DepositAndWithdrawFormUsersBalance'
import { ExecuteWithdrawScheduledOrInstantWithFee } from 'lib/components/ExecuteWithdrawScheduledOrInstantWithFee'
import { Meta } from 'lib/components/Meta'
import { TicketQuantityForm } from 'lib/components/TicketQuantityForm'
import { WithdrawComplete } from 'lib/components/WithdrawComplete'
import { WithdrawInstantOrScheduled } from 'lib/components/WithdrawInstantOrScheduled'
import { WizardLayout } from 'lib/components/WizardLayout'

export const WithdrawWizardContainer = (props) => {
  const router = useRouter()
  const quantity = router.query.quantity

  let initialStepIndex = 0
  if (quantity) {
    initialStepIndex = 1
  }

  const poolData = useContext(PoolDataContext)
  const {
    pool,
    usersTicketBalance
  } = poolData

  let underlyingCollateralDecimals = 18
  underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals
  
  const [cachedUsersBalance, setCachedUsersBalance] = useState(usersTicketBalance)
  const [totalWizardSteps, setTotalWizardSteps] = useState(3)

  useEffect(() => {
    setCachedUsersBalance(usersTicketBalance)
  }, [usersTicketBalance])

  let balanceJsx = null
  if (pool) {
    balanceJsx = <DepositAndWithdrawFormUsersBalance
      widthClasses={'w-full xs:w-5/12'}
      roundedClasses='rounded-lg'
      label='Your ticket balance:'
      start={cachedUsersBalance || usersTicketBalance}
      end={usersTicketBalance}
    />
  }


  return <>
    <Meta
      title={`Withdraw`}
    />

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
            totalWizardSteps={totalWizardSteps}
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
                return <WithdrawInstantOrScheduled
                  pool={pool}
                  quantity={quantity}
                  nextStep={step.nextStep}
                  previousStep={step.previousStep}
                  setTotalWizardSteps={setTotalWizardSteps}
                />
              }}
            </WizardStep>
            
            {totalWizardSteps === 4 && <>
              <WizardStep>
                {(step) => {
                  return step.isActive && <>
                    <ExecuteWithdrawScheduledOrInstantWithFee
                      nextStep={step.nextStep}
                      previousStep={step.previousStep}
                    />
                  </>
                }}
              </WizardStep>
            </>}

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
