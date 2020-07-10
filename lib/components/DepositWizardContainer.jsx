import React from 'react'
import { Wizard, WizardStep, useWizardStep } from 'react-wizard-primitive'

import { DepositWizardLayout } from 'lib/components/DepositWizardLayout'
import { FiatOrCryptoForm } from 'lib/components/FiatOrCryptoForm'
import { TicketQuantityForm } from 'lib/components/TicketQuantityForm'

export const DepositWizardContainer = (props) => {
  return <>
    <Wizard
      // onChange={({ newStepIndex, previousStepIndex }) => {
      //   console.log(`I moved from step ${previousStepIndex} to ${newStepIndex}`);
      // }}
    >
      {
        (wizard) => {
          const { activeStepIndex, previousStep, moveToStep } = wizard

          return <DepositWizardLayout
            currentWizardStep={activeStepIndex + 1}
            handlePreviousStep={previousStep}
            moveToStep={moveToStep}
            totalWizardSteps={4}
          >
            <WizardStep>
              {
                (step) => {
                  return step.isActive && <>
                    <TicketQuantityForm
                      nextStep={step.nextStep}
                    />
                  </>
                }
              }
            </WizardStep>
            <WizardStep>
              {
                (step) => {
                  return step.isActive && <>
                    <FiatOrCryptoForm
                      nextStep={step.nextStep}
                    />
                  </>
                }
              }
            </WizardStep>
          </DepositWizardLayout>
        }
      }
    </Wizard>
  </>
}
