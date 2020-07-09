import React from 'react'
import { Wizard, WizardStep, useWizardStep } from 'react-wizard-primitive'

import { DepositWizardLayout } from 'lib/components/DepositWizardLayout'
import { TicketQuantityForm } from 'lib/components/TicketQuantityForm'

const FirstStep = (props) => {
  const { step } = props
  // const { isActive, nextStep } = useWizardStep()

  return step.isActive && <>
      <TicketQuantityForm
        nextStep={step.nextStep}
      />
    </>
}

const SecondStep = (props) => {
  const { step } = props
  // const { isActive, nextStep } = useWizardStep()

  return step.isActive && <>
      <div className='text-inverse'>Step 2, how do you want to buy?</div>
    </>
}

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
                  return <FirstStep step={step} />
                }
              }
            </WizardStep>
            <WizardStep>
              {
                (step) => {
                  return <SecondStep step={step} />
                }
              }
            </WizardStep>
          </DepositWizardLayout>
        }
      }
    </Wizard>
  </>
}
