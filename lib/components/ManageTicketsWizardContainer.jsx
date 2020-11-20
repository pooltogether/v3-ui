import React, { useContext, useEffect, useState } from 'react'
import { Wizard, WizardStep } from 'react-wizard-primitive'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ExecuteWithdrawScheduledOrInstantWithFee } from 'lib/components/ExecuteWithdrawScheduledOrInstantWithFee'
import { Meta } from 'lib/components/Meta'
import { ManageTicketsForm } from 'lib/components/ManageTicketsForm'
import { WithdrawComplete } from 'lib/components/WithdrawComplete'
import { WithdrawInstantOrScheduled } from 'lib/components/WithdrawInstantOrScheduled'
import { WizardLayout } from 'lib/components/WizardLayout'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

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

          const back = (e) => {
            queryParamUpdater.remove(router, 'withdrawType')
            previousStep()
          } 

          return <WizardLayout
            currentWizardStep={activeStepIndex + 1}
            handlePreviousStep={back}
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
                if (!step.isActive) {
                  return null
                }

                const back = (e) => {
                  queryParamUpdater.remove(router, 'withdrawType')
                  step.previousStep()
                } 

                return <WithdrawInstantOrScheduled
                  pool={pool}
                  quantity={quantity}
                  nextStep={step.nextStep}
                  previousStep={back}
                  setTotalWizardSteps={setTotalWizardSteps}
                />
              }}
            </WizardStep>
            
            {totalWizardSteps === 4 && <>
              <WizardStep>
                {(step) => {
                  const back = (e) => {
                    queryParamUpdater.remove(router, 'withdrawType')
                    step.previousStep()
                  } 

                  return step.isActive && <>
                    <ExecuteWithdrawScheduledOrInstantWithFee
                      nextStep={step.nextStep}
                      previousStep={back}
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
