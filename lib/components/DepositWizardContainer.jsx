import React from 'react'
import { Wizard, WizardStep, useWizardStep } from 'react-wizard-primitive'

import { DepositWizardLayout } from 'lib/components/DepositWizardLayout'
import { TicketQuantityForm } from 'lib/components/TicketQuantityForm'

const FirstStep = (props) => {
  const { step } = props
  // console.log({firstStep: step})
  // const { isActive, nextStep } = useWizardStep()
  // const step = useWizardStep()
  // console.log(step.nextStep)
  // console.log('FirstStep')

  // console.log({ isActive: step.isActive })
  // console.log({ index: step.index })
  return step.isActive && <>
      <TicketQuantityForm
        nextStep={step.nextStep}
      />
    </>
}

const SecondStep = (props) => {
  const { step } = props
  // console.log({ secondStep: step })
  // const { isActive, nextStep, index } = useWizardStep()

  // console.log('---------------');
  
  // const { isActive, nextStep } = useWizardStep()
  // const step = useWizardStep()
  // console.log(step.nextStep)
  // console.log('SecondStep')

  // console.log({ isActive: step.isActive })
  // console.log({ index: step.index })

  // console.log('++++++++++++++++');

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
                  console.log({step})
                  return <FirstStep step={step} />
                }
              }
            </WizardStep>
            <WizardStep>
              {
                (step) => {
                  console.log({ step })
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
