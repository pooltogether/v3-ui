import React, { useContext, useEffect, useState } from 'react'
import { Wizard, WizardStep } from 'react-wizard-primitive'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ConfirmWithdrawWithFeeForm } from 'lib/components/ConfirmWithdrawWithFeeForm'
import { Meta } from 'lib/components/Meta'
import { ManageTicketsForm } from 'lib/components/ManageTicketsForm'
import { WithdrawComplete } from 'lib/components/WithdrawComplete'
import { WithdrawInstant } from 'lib/components/WithdrawInstant'
import { WizardLayout } from 'lib/components/WizardLayout'

export function ManageTicketsWizardContainer(props) {
  const { t } = useTranslation()
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
  
  const [totalWizardSteps, setTotalWizardSteps] = useState(3)

  return <>
    <Meta
      title={t('withdraw')}
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
                  <ManageTicketsForm
                    nextStep={step.nextStep}
                    usersTicketBalance={usersTicketBalance}
                    underlyingCollateralDecimals={underlyingCollateralDecimals}
                  />
                </>
              }}
            </WizardStep>

            <WizardStep>
              {(step) => {
                return step.isActive && <>
                  <WithdrawInstant
                    pool={pool}
                    quantity={quantity}
                    nextStep={step.nextStep}
                    previousStep={step.previousStep}
                    setTotalWizardSteps={setTotalWizardSteps}
                  />
                </>
              }}
            </WizardStep>
            
            {totalWizardSteps === 4 && <>
              <WizardStep>
                {(step) => {
                  return step.isActive && <>
                    <ConfirmWithdrawWithFeeForm
                      pool={pool}
                      nextStep={step.nextStep}
                      quantity={quantity}
                    />
                  </>
                }}
              </WizardStep>
            </>}

            <WizardStep>
              {(step) => {
                return step.isActive && <>
                  <WithdrawComplete
                    quantity={quantity}
                  />
                </>
              }}
            </WizardStep>
          </WizardLayout>
        }
      }
    </Wizard>
  </>
}
