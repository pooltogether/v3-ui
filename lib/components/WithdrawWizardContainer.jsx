import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { Wizard, WizardStep } from 'react-wizard-primitive'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { NoFeeInstantWithdrawal } from 'lib/components/NoFeeInstantWithdrawal'
// import { InstantOrScheduledForm } from 'lib/components/InstantOrScheduledForm'
import { WithdrawComplete } from 'lib/components/WithdrawComplete'
import { TicketQuantityForm } from 'lib/components/TicketQuantityForm'
import { WizardLayout } from 'lib/components/WizardLayout'

export const WithdrawWizardContainer = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

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
                    formName='Withdraw'
                    nextStep={step.nextStep}
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
